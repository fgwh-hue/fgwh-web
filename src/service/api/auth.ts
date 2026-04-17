import { request } from '../request';

export function fetchLogin(email: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: { email, password }
  });
}

export function fetchRegister(email: string, password: string, nickname?: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/register',
    method: 'post',
    data: {
      email,
      password,
      nickname
    }
  });
}

export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/me' });
}

export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refresh',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
