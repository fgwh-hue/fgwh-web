import { request } from '../request';
// import { getMockStudentList, getMockTeacherList } from '../mock';

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  });
}

/** get student list */
export function fetchGetStudentList(params?: Api.SystemManage.StudentSearchParams) {
  console.log('fetchGetStudentList params:', JSON.stringify(params, null, 2));
  return request<Api.SystemManage.StudentList>({
    url: '/students',
    method: 'get',
    params
  });
}

/** add student */
export function fetchAddStudent(data: Api.SystemManage.StudentForm) {
  return request<Api.SystemManage.Student>({
    url: '/students',
    method: 'post',
    data
  });
}

/** edit student */
export function fetchEditStudent(id: string, data: Api.SystemManage.StudentForm) {
  return request<Api.SystemManage.Student>({
    url: `/students/${id}`,
    method: 'patch',
    data
  });
}

/** delete student */
export function fetchDeleteStudent(id: string) {
  return request<void>({
    url: `/students/${id}`,
    method: 'delete'
  });
}

/** get teacher list */
export function fetchGetTeacherList(params?: Api.SystemManage.TeacherSearchParams) {
  return request<Api.SystemManage.TeacherList>({
    url: '/teachers',
    method: 'get',
    params
  });
}

/** add teacher */
export function fetchAddTeacher(data: Api.SystemManage.TeacherForm) {
  return request<Api.SystemManage.Teacher>({
    url: '/teachers',
    method: 'post',
    data
  });
}

/** edit teacher */
export function fetchEditTeacher(id: string, data: Api.SystemManage.TeacherForm) {
  return request<Api.SystemManage.Teacher>({
    url: `/teachers/${id}`,
    method: 'patch',
    data
  });
}

/** delete teacher */
export function fetchDeleteTeacher(id: string) {
  return request<void>({
    url: `/teachers/${id}`,
    method: 'delete'
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}
