
const personnelManageAction = {
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
  fetchSuccess: Symbol('fetchSuccess'),
  getAllUserBase: Symbol('getAllUserBase'), // 所有用户基础信息 => 用于分配人员
  getDepartmentAllUser: Symbol('getDepartmentAllUser'), // 指定部门内所有用户id集合
  assignUsers: Symbol('assignUsers'), // 分配用户 + 部门
  downloadTemplate: Symbol('downloadTemplate'), // 下载导入模板
  getDepartmentTreeData: Symbol('getDepartmentTreeData'), // 获取部门树
  addNewDepartment: Symbol('addNewDepartment'), // 新增部门
  editDepartment: Symbol('editDepartment'), // 编辑部门详情
  getStationOfDepartment: Symbol('getStationOfDepartment'), // 指定部门电站信息获取
  preDeleteDepartmentCheck: Symbol('preDeleteDepartmentCheck'), // 删除部门前确认
  deleteDepartment: Symbol('deleteDepartment'), // 删除部门
  getUserList: Symbol('getUserList'), // 请求用户列表
  editDepartmentStations: Symbol('editDepartmentStations'), // 修改部门下电站
  getUserDetailInfo: Symbol('getUserDetailInfo'), // 获取用户详情
  setUserStatus: Symbol('setUserStatus'), // 审核 / 注销用户
  getRoleAllList: Symbol('getRoleAllList'), // 获取所有角色
  addUser: Symbol('addUser'), // 新增用户
  editUser: Symbol('editUser'), // 编辑用户
};

const initState = {
  pageKey: 'list', // list列表-addPersonnel添加人员-editPersonnel编辑人员-detailPersonnel人员信息详情

  selectedDepartment: {
    departmentId: '1',
    departmentName: '未分配部门人员',
    departmentSource: '0',
  }, // 选中的部门信息 {}; => 右侧用户页面展示依据。 默认为未分配人员部门 id约定为1
  userListParams: {
    username: '',
    phoneNum: '',
    stationName: '',
    departmentId: '1',
  }, // 展示用户列表请求信息
  userListPageInfo: {
    pageNum: 1,
    pageSize: 10,
    sortField: 'u.create_time', // 排序（默认u.create_time，用户状态eu.enterprise_user_status）
    sortMethod: 'desc', // 排序规则 "asc"：正序  "desc"：倒序
  }, // 展示用户列表页面信息

  personnelDrawerIds: [], // 用户审核 抽屉要修改的用户id集合 => 同时根据length控制抽屉的展示/隐藏
  departmentDrawerKey: 'hide', // 添加部门 add + 编辑部门 edit + 隐藏抽屉 hide
  departmentEditInfo: {}, // departmentDrawerKey为edit时, 选中要去编辑的部门的信息
  showLogoutModal: false, // 注销弹框

  templateLoading: false, // 导入模板下载
  departmentTreeLoading: false, // 部门树loading
  addDepartmentLoading: false, // 部门添加loading;
  addDepartmentSuccess: false, // 部门添加/编辑结果;

  preDeleteText: '', // 部门删除以前的提示语
  deleteDepartmentSuccess: false, // 部门删除结果
  assignUserLoading: false, // 部门分配loading;
  assignUserSuccess: false, // 部门分配结果;
  showSingleAssignModal: false, // 部门树用户分配弹框的展示

  selectedRowKeys: [], // 用户列表选中列;
  showDepartmentStationModal: false, // 部门分配电站弹框
  userListLoading: false, // 页面部门loading状态
  logoutSuccess: false, // 注销/审核(改变用户状态)成功
  examineLoading: false, // 审核弹框loading
  examineSuccess: false, // 审核成功

  addUserLoading: false, // 添加-编辑用户loading
  addUserSuccess: false, // 添加-编辑用户成功状态

  allBaseUserData: [], // 所有用户基础信息 => 用于分配人员
  departmentAllUsers: [], // 选中部门内所有用户 => 用于分配人员和部门内搜索模糊匹配;

  departmentTree: [], // 部门树形结构
  departmentStations: [], // 主界面 部门负责电站
  userList: [], // 主界面用户列表
  userListTotalNum: 0, // 用户列表合计
  userDetailInfo: {}, // 用户详情查看
  roleAllList: [], // 普通角色列表
  specialRoleList: [], // 特殊权限列表
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
