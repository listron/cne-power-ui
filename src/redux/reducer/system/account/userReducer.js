import immutable from 'immutable';

import { userAction } from '../../../../constants/actionTypes/system/account/userAction';

var initState = immutable.fromJS({
  loading: false,
  showPage: 'list',//默认显示list,可显示list,detail,edit,add
  enterpriseId: '',//企业ID
  roleId: '',//角色ID 
  roleName: '',//筛选条件：角色
  userStatus: 0,//筛选条件： 状态  0:全部，1：激活，2：未激活，3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
  sort: '',//排序规则
  ascend: true,//排序方式
  userName: '',//筛选条件：用户名
  phoneNum: '',//筛选条件：电话
  stationName: '',//筛选条件：负责电站
  totalNum: 0,//列表页总条数
  currentPage: 1,//当前页
  pageSize: 10,//每页容纳条数
  userDetail:{},//选中用户详细信息
  selectedUser: [], //table选中用户项
  userData: [],//用户列表数据
})

const userReducer = (state = initState, action) => {
  console.log(action)
  switch(action.type){
    case userAction.USER_FETCH:
      return state.set('loading', true)
    case userAction.GET_USER_COMMON_FETCH_SUCCESS:
      return state.merge(immutable.fromJS(action.payload)).set('loading', false)
    case userAction.CHANGE_USER_STORE_SUCCESS:
      return state.merge(immutable.fromJS(action.payload))
    
  }
  return state;
}

export default userReducer;