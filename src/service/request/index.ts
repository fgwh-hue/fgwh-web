import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

// 模拟的用户数据库
const userDatabase: Record<string, Api.Auth.UserInfo> = {
  student: {
    userId: '1001',
    userName: '同学',
    roles: ['R_STUDENT'],
    buttons: []
  },
  teacher: {
    userId: '2001',
    userName: '老师',
    roles: ['R_TEACHER'],
    buttons: []
  },
  Admin: {
    userId: '1',
    userName: '管理员',
    roles: ['R_ADMIN'],
    buttons: ['B_CODE_ADD', 'B_CODE_EDIT']
  }
};

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      // Mock login request
      if (config.url === '/auth/login' && config.method === 'post') {
        const data = config.data as { userName: string; password: string };
        if (!userDatabase[data.userName]) {
          return {
            ...config,
            adapter: async () => ({
              data: {
                code: '0001',
                msg: '用户名或密码错误',
                data: null
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            })
          };
        }
        localStorage.setItem('mock_login_user', data.userName);
        return {
          ...config,
          adapter: async () => ({
            data: {
              code: '0000',
              msg: 'success',
              data: {
                token: `${data.userName}_token`,
                refreshToken: `${data.userName}_refreshToken`
              }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          })
        };
      }

      // Mock getUserInfo request
      if (config.url === '/auth/getUserInfo' && config.method === 'get') {
        const loginUserName = localStorage.getItem('mock_login_user');
        if (!loginUserName || !userDatabase[loginUserName]) {
          return {
            ...config,
            adapter: async () => ({
              data: {
                code: '0001',
                msg: '用户不存在',
                data: null
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            })
          };
        }
        const userInfo = userDatabase[loginUserName];
        return {
          ...config,
          adapter: async () => ({
            data: {
              code: '0000',
              msg: 'success',
              data: userInfo
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          })
        };
      }

      // Mock getUserRoutes request
      if (config.url === '/route/getUserRoutes' && config.method === 'get') {
        const loginUserName = localStorage.getItem('mock_login_user');
        if (!loginUserName || !userDatabase[loginUserName]) {
          return {
            ...config,
            adapter: async () => ({
              data: {
                code: '0001',
                msg: '用户不存在',
                data: null
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            })
          };
        }

        const userInfo = userDatabase[loginUserName];
        let routes: Api.Route.MenuRoute[] = [];
        let home = 'home';

        if (userInfo.roles.includes('R_STUDENT')) {
          // 学生：显示学生端、首页、文档
          routes = [
            {
              name: 'home',
              path: '/home',
              component: 'layout.base$view.home',
              meta: {
                title: '学生首页',
                i18nKey: 'route.home',
                icon: 'mdi:monitor-dashboard',
                order: 1
              }
            },
            {
              name: 'student',
              path: '/student',
              component: 'layout.base',
              meta: {
                title: '学生中心',
                i18nKey: 'route.student',
                localIcon: 'home',
                order: 2
              },
              children: [
                {
                  name: 'student_dashboard',
                  path: '/student/dashboard',
                  component: 'view.student_dashboard',
                  meta: {
                    title: '个性化学习中心',
                    i18nKey: 'route.student_dashboard',
                    localIcon: 'home',
                    order: 1
                  }
                },
                {
                  name: 'student_ai-tutor',
                  path: '/student/ai-tutor',
                  component: 'view.student_ai-tutor',
                  meta: {
                    title: 'AI助教互动',
                    i18nKey: 'route.student_ai-tutor',
                    localIcon: 'robot',
                    order: 2
                  }
                },
                {
                  name: 'student_learning-progress',
                  path: '/student/learning-progress',
                  component: 'view.student_learning-progress',
                  meta: {
                    title: '学习进度追踪',
                    i18nKey: 'route.student_learning-progress',
                    localIcon: 'chart-timeline-variant',
                    order: 3
                  }
                }
              ]
            },
            {
              name: 'document',
              path: '/document',
              component: 'layout.base',
              meta: {
                title: '文档',
                i18nKey: 'route.document',
                order: 3,
                icon: 'mdi:file-document-multiple-outline'
              },
              children: [
                {
                  name: 'document_project',
                  path: '/document/project',
                  component: 'view.iframe-page',
                  props: {
                    url: 'https://docs.soybeanjs.cn/zh'
                  },
                  meta: {
                    title: '项目文档',
                    i18nKey: 'route.document_project',
                    order: 1,
                    localIcon: 'logo'
                  }
                }
              ]
            }
          ];
          home = 'home';
        } else if (userInfo.roles.includes('R_TEACHER')) {
          // 教师：显示首页、文档
          routes = [
            {
              name: 'home',
              path: '/home',
              component: 'layout.base$view.home',
              meta: {
                title: '教师首页',
                i18nKey: 'route.home',
                icon: 'mdi:monitor-dashboard',
                order: 1
              }
            },
            {
              name: 'document',
              path: '/document',
              component: 'layout.base',
              meta: {
                title: '文档',
                i18nKey: 'route.document',
                order: 2,
                icon: 'mdi:file-document-multiple-outline'
              },
              children: [
                {
                  name: 'document_project',
                  path: '/document/project',
                  component: 'view.iframe-page',
                  props: {
                    url: 'https://docs.soybeanjs.cn/zh'
                  },
                  meta: {
                    title: '项目文档',
                    i18nKey: 'route.document_project',
                    order: 1,
                    localIcon: 'logo'
                  }
                }
              ]
            }
          ];
          home = 'home-teacher';
        } else if (userInfo.roles.includes('R_ADMIN')) {
          // 管理员：显示除了学生端外的所有页面
          routes = [
            {
              name: 'home',
              path: '/home',
              component: 'layout.base$view.home',
              meta: {
                title: '首页',
                i18nKey: 'route.home',
                icon: 'mdi:monitor-dashboard',
                order: 1
              }
            },
            {
              name: 'manage',
              path: '/manage',
              component: 'layout.base',
              meta: {
                title: '系统管理',
                i18nKey: 'route.manage',
                icon: 'carbon:cloud-service-management',
                order: 2,
                roles: ['R_ADMIN']
              },
              children: [
                {
                  name: 'manage_user',
                  path: '/manage/user',
                  component: 'view.manage_user',
                  meta: {
                    title: '用户管理',
                    i18nKey: 'route.manage',
                    icon: 'ic:round-manage-accounts',
                    order: 1,
                    roles: ['R_ADMIN']
                  }
                },
                {
                  name: 'manage_menu',
                  path: '/manage/menu',
                  component: 'view.manage_menu',
                  meta: {
                    title: '菜单管理',
                    i18nKey: 'route.manage_menu',
                    icon: 'material-symbols:route',
                    order: 2,
                    roles: ['R_ADMIN']
                  }
                }
              ]
            },
            {
              name: 'document',
              path: '/document',
              component: 'layout.base',
              meta: {
                title: '文档',
                i18nKey: 'route.document',
                order: 3,
                icon: 'mdi:file-document-multiple-outline'
              },
              children: [
                {
                  name: 'document_project',
                  path: '/document/project',
                  component: 'view.iframe-page',
                  props: {
                    url: 'https://docs.soybeanjs.cn/zh'
                  },
                  meta: {
                    title: '项目文档',
                    i18nKey: 'route.document_project',
                    order: 1,
                    localIcon: 'logo'
                  }
                }
              ]
            }
          ];
          home = 'home';
        }

        return {
          ...config,
          adapter: async () => ({
            data: {
              code: '0000',
              msg: 'success',
              data: {
                routes,
                home
              }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          })
        };
      }

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      function handleLogout() {
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        return null;
      }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.msg)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout);

        window.$dialog?.error({
          title: $t('common.error'),
          content: response.data.msg,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          closeOnEsc: false,
          onPositiveClick() {
            logoutAndCleanup();
          },
          onClose() {
            logoutAndCleanup();
          }
        });

        return null;
      }

      // when the backend response code is in `expiredTokenCodes`, it means the token is expired, and refresh token
      // the api `refreshToken` can not return error code in `expiredTokenCodes`, otherwise it will be a dead loop, should return `logoutCodes` or `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    transformBackendResponse(response: AxiosResponse) {
      const data = response.data;
      if (typeof data === 'object' && data !== null) {
        if ('result' in data) {
          return data.result;
        } else if ('data' in data) {
          return data.data;
        }
      }
      return data;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;
      let backendErrorCode = '';

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    }
  }
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    transformBackendResponse(response: AxiosResponse) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'result' in data) {
        return data.result;
      }
      return data;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
