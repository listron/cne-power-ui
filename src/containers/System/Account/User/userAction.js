
export const userAction = {
  USER_FETCH: Symbol('USER_FETCH'),

  CHANGE_USER_STORE_SAGA: Symbol('CHANGE_USER_STORE_SAGA'),// 更改reducer
  CHANGE_USER_STORE: Symbol('CHANGE_USER_STORE'),

  GET_USER_FETCH_SUCCESS: Symbol('GET_USER_FETCH_SUCCESS'),//公共请求API成功
  GET_USER_FETCH_FAIL: Symbol('GET_USER_FETCH_FAIL'),//公共请求API失败
  GET_USER_LIST_SAGA: Symbol('GET_USER_LIST_SAGA'), //获取列表

  GET_USER_DETAIL_SAGA: Symbol('GET_USER_DETAIL_SAGA'), //获取详情

  EDIT_USER_INFO_SAGA: Symbol('EDIT_USER_INFO_SAGA'),//编辑用户

  CHANGE_USER_STATUS_SAGA: Symbol('CHANGE_USER_STATUS_SAGA'),//改变用户状态

  CREATE_USER_INFO_SAGA: Symbol('CREATE_USER_INFO_SAGA'),//新建用户信息

  GET_INVITE_LINK_SAGA: Symbol('GET_INVITE_LINK_SAGA'),//邀请用户信息

  GET_ROLE_ALL_LIST_SAGA: Symbol('GET_ROLE_ALL_LIST_SAGA'),//获取角色列表

  RESET_USER_STATE_SAGA: Symbol('RESET_USER_STATE_SAGA'),//重置用户状态
  RESET_USER: Symbol('RESET_USER'),//重置用户状态成功
}
