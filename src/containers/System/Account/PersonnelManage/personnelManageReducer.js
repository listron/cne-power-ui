
const personnelManageAction = {
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
  fetchSuccess: Symbol('fetchSuccess'),
  getAllUserBase: Symbol('getAllUserBase'), // 所有用户基础信息 => 用于分配人员
  downloadTemplate: Symbol('downloadTemplate'), // 下载导入模板
  getDepartmentTreeData: Symbol('getDepartmentTreeData'), // 获取部门树
  addNewDepartment: Symbol('addNewDepartment'), // 新增部门
  editDepartment: Symbol('editDepartment'), // 编辑部门详情
  getStationOfDepartment: Symbol('getStationOfDepartment'), // 指定部门电站信息获取
  getUserList: Symbol('getUserList'), // 请求用户列表
};

const initState = {
  pageKey: 'list', // list列表-addPersonnel添加人员-editPersonnel编辑人员-detailPersonnel人员信息详情

  selectedDepartment: { departmentId: '1' }, // 选中的部门信息 {}; => 右侧用户页面展示依据。 默认为未分配人员部门 id约定为1
  userListParams: {}, // 展示用户列表请求信息
  userListPageInfo: {}, // 展示用户列表页面信息

  showPersonnelDrawer: false, // 用户审核 抽屉
  departmentDrawerKey: 'hide', // 添加部门 add + 编辑部门 edit + 隐藏抽屉 hide
  departmentEditInfo: {}, // departmentDrawerKey为edit时, 选中要去编辑的部门的信息
  showLogoutModal: false, // 注销弹框

  templateLoading: false, // 导入模板下载
  departmentTreeLoading: false, // 部门树loading
  addDepartmentLoading: false, // 部门添加loading;

  // addUserLoading: false, // 添加人员loading状态
  // userListLoading: false, // 页面部门loading状态
  // logoutLoading: false, // 注销用户loading状态

  allBaseUserData: [], // 所有用户基础信息 => 用于分配人员
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
