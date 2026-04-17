declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      userName: string;
      /** user gender */
      userGender: UserGender | null;
      /** user nick name */
      nickName: string;
      /** user phone */
      userPhone: string;
      /** user email */
      userEmail: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** student */
    type Student = {
      /** student name */
      studentName: string;
      /** student gender */
      studentGender: UserGender | null;
      /** student nick name */
      nickName: string;
      /** student phone */
      studentPhone: string;
      /** student email */
      studentEmail: string;
      /** student no (学号) */
      studentNo: string;
      /** student major (专业) */
      studentMajor: string;
      /** student class (班级) */
      studentClass: string;
      /** avatar url */
      avatar?: string;
    } & Common.CommonRecord;

    /** student search params */
    type StudentSearchParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.Student,
        | 'studentName'
        | 'studentGender'
        | 'nickName'
        | 'studentPhone'
        | 'studentEmail'
        | 'studentNo'
        | 'studentMajor'
        | 'studentClass'
        | 'status'
      > &
        CommonSearchParams
    >;

    /** student list */
    type StudentList = Common.PaginatingQueryRecord<Student>;

    /** student form data */
    type StudentForm = Pick<
      Api.SystemManage.Student,
      'studentName' | 'studentGender' | 'studentNo' | 'studentEmail' | 'studentPhone' | 'studentMajor' | 'studentClass'
    > & { status?: boolean };

    /** teacher */
    type Teacher = {
      /** teacher name */
      teacherName: string;
      /** teacher gender */
      teacherGender: UserGender | null;
      /** teacher nick name */
      nickName: string;
      /** teacher phone */
      teacherPhone: string;
      /** teacher email */
      teacherEmail: string;
      /** teacher no (工号) */
      teacherNo: string;
      /** teacher title (职称) */
      teacherTitle: string;
      /** teacher department (院系) */
      teacherDepartment: string;
      /** avatar url */
      avatar?: string;
    } & Common.CommonRecord;

    /** teacher search params */
    type TeacherSearchParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.Teacher,
        | 'teacherName'
        | 'teacherGender'
        | 'nickName'
        | 'teacherPhone'
        | 'teacherEmail'
        | 'teacherNo'
        | 'teacherTitle'
        | 'teacherDepartment'
        | 'status'
      > &
        CommonSearchParams
    >;

    /** teacher list */
    type TeacherList = Common.PaginatingQueryRecord<Teacher>;

    /** teacher form data */
    type TeacherForm = Pick<
      Api.SystemManage.Teacher,
      | 'teacherName'
      | 'teacherGender'
      | 'teacherNo'
      | 'teacherEmail'
      | 'teacherPhone'
      | 'teacherTitle'
      | 'teacherDepartment'
    > & { status?: boolean };

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number;
      /** menu type */
      menuType: MenuType;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
