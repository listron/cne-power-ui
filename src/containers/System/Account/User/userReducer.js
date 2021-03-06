import Immutable from 'immutable';
import { userAction } from './userAction';

var initState = Immutable.fromJS({
  loading: false,
  downloading: false, // 模板下载loading
  showPage: 'list',//默认显示list,可显示list,detail,edit,add
  enterpriseId: '',//企业ID
  roleId: '',//筛选条件：选中的角色Id信息
  userStatus: 0,//筛选条件： 状态  0:全部，1：激活，2：未激活，3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
  sort: '',//排序规则
  username: '',//筛选条件：用户名
  phoneNum: '',//筛选条件：电话
  stationName: '',//筛选条件：负责电站
  totalNum: 0,//列表页总条数
  pageNum: 1,//当前页
  pageSize: 10,//每页容纳条数
  userDetail:{},//选中用户详细信息
  selectedUser: [], //table选中用户项
  selectedKey: [],//table选中项的key
  userData: [],//用户列表数据
  inviteData: {},//邀请用户数据
  roleAllList: [],//获取企业角色列表
  specialRoleList: [],//获取特殊权限
  order: "",//列表排序 默认0不排序 12角色  34特殊权限  56企业名称  倒序正序
});

const userReducer = (state = initState, action) => {
  switch(action.type){
    case userAction.USER_FETCH:
      return state.set('loading', true);
    case userAction.GET_USER_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case userAction.CHANGE_USER_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case userAction.GET_USER_FETCH_FAIL:
      return state.set('loading', false);
    case userAction.RESET_USER:
      return initState;
  }
  return state;
}

export default userReducer;
