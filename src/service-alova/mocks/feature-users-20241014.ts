import { defineMock } from '@sa/alova/mock';
import type { LastLevelRouteKey } from '@elegant-router/types';

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
  // Super: {
  //   userId: '0',
  //   userName: 'Super',
  //   roles: ['R_SUPER'],
  //   buttons: []
  // }
};

// 学生角色的菜单 (移除 id 属性)
const studentMenus: Api.Route.MenuRoute[] = [
  {
    name: 'student_dashboard',
    path: '/student/dashboard',
    component: 'layout.base$view.student_dashboard',
    meta: {
      title: '个性化学习中心',
      i18nKey: 'route.student_dashboard',
      localIcon: 'home',
      order: 1,
      roles: ['R_STUDENT']
    }
  },
  {
    name: 'student_ai-tutor',
    path: '/student/ai-tutor',
    component: 'layout.base$view.student_ai-tutor',
    meta: {
      title: 'AI助教互动',
      i18nKey: 'route.student_ai-tutor',
      localIcon: 'robot',
      order: 2,
      roles: ['R_STUDENT']
    }
  },
  {
    name: 'student_learning-progress',
    path: '/student/learning-progress',
    component: 'layout.base$view.student_learning-progress',
    meta: {
      title: '学习进度追踪',
      i18nKey: 'route.student_learning-progress',
      localIcon: 'chart-timeline-variant',
      order: 3,
      roles: ['R_STUDENT']
    }
  }
];

// 管理员和超级管理员的菜单 (已移除 id 属性)
const adminMenus: Api.Route.MenuRoute[] = [
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
      order: 9,
      roles: ['R_ADMIN']
    },
    children: [
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: '用户管理',
          i18nKey: 'route.manage_user',
          icon: 'ic:round-manage-accounts',
          order: 1,
          roles: ['R_ADMIN']
        }
      }
    ]
  }
];

export default defineMock({
  '[POST]/auth/login': ({ data }) => {
    // 验证用户是否存在
    if (!userDatabase[data.userName]) {
      return {
        code: '0001',
        msg: '用户名或密码错误',
        data: null
      };
    }

    localStorage.setItem('mock_login_user', data.userName);
    return {
      code: '0000',
      msg: 'success',
      data: {
        token: `${data.userName}_token`,
        refreshToken: `${data.userName}_refreshToken`
      }
    };
  },

  '[GET]/auth/getUserInfo': () => {
    const loginUserName = localStorage.getItem('mock_login_user');
    if (!loginUserName || !userDatabase[loginUserName]) {
      return {
        code: '0001',
        msg: '用户不存在',
        data: null
      };
    }

    const userInfo = userDatabase[loginUserName];
    return {
      code: '0000',
      msg: 'success',
      data: userInfo
    };
  },

  '[GET]/route/getUserRoutes': () => {
    const loginUserName = localStorage.getItem('mock_login_user') || 'Super';
    const userInfo = userDatabase[loginUserName];

    let routes: Api.Route.MenuRoute[] = [];
    let home: LastLevelRouteKey = 'home';

    if (userInfo.roles.includes('R_STUDENT')) {
      routes = studentMenus;
      home = 'student_dashboard';
    } else if (userInfo.roles.includes('R_TEACHER')) {
      routes = adminMenus;
      home = 'teacher_dashboard';
    } else if (userInfo.roles.includes('R_ADMIN') || userInfo.roles.includes('R_SUPER')) {
      routes = adminMenus;
      home = 'home';
    }

    return {
      code: '0000',
      msg: 'success',
      data: {
        routes,
        home
      }
    };
  },

  // --- 以下是文件中原有的其他 Mock 配置 ---
  '[POST]/systemManage/addUser': () => ({ code: '0000', msg: 'success', data: null }),
  '[POST]/systemManage/updateUser': () => ({ code: '0000', msg: 'success', data: null }),
  '[DELETE]/systemManage/deleteUser': () => ({ code: '0000', msg: 'success', data: null }),
  '[DELETE]/systemManage/batchDeleteUser': () => ({ code: '0000', msg: 'success', data: null }),
  '[POST]/auth/sendCaptcha': () => ({ code: '0000', msg: 'success', data: null }),
  '[POST]/auth/verifyCaptcha': () => ({ code: '0000', msg: 'success', data: null }),
  '/mock/getLastTime': () => ({ code: '0000', msg: 'success', data: { time: new Date().toLocaleTimeString() } })
});
