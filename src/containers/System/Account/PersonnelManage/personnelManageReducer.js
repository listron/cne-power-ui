
const personnelManageAction = {
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
  fetchSuccess: Symbol('fetchSuccess'),
  getUserList: Symbol('getUserList'), // 请求用户列表
};

const initState = {
  pageKey: 'list', // list列表-addUser添加人员-editUser编辑人员-detailUser人员信息详情
  selectedDepartment: '', // 选中的部门id信息; => 右侧用户页面展示依据。
  userListParams: {}, // 展示用户列表请求信息
  userListPageInfo: {}, // 展示用户列表页面信息

  showPersonnelDrawer: false, // 用户审核 抽屉
  showDepartmentDrawer: false, // 添加部门 + 编辑部门 抽屉
  showLogoutModal: false, // 注销弹框
  addUserLoading: false, // 添加人员loading状态
  addDepartmentLoading: false, // 添加部门loading状态
  userListLoading: false, // 页面部门loading状态
  logoutLoading: false, // 注销用户loading状态

  departmentTree: [], // 部门树形结构
  userList: [], // 主界面用户列表
};

const personnelManage = (state = initState, action) => {
  switch(action.type){
    case personnelManageAction.fetchSuccess:
      return { ...state, ...action.payload };
    case personnelManageAction.changeStore:
      return { ...state, ...action.payload };
    case personnelManageAction.reset:
      return initState;
  }
  return state;
};

export { personnelManage, personnelManageAction };
