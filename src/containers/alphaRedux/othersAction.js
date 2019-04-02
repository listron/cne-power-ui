export const othersAction = {
  OTHERS_FETCH: Symbol('OTHERS_FETCH'), //loading状态管理
  changeOthersStore: Symbol('changeOthersStore'), // 触发store基础数据改变
  CHANGE_OTHERS_STORE: Symbol('CHANGE_OTHERS_STORE'), // 替换改变other store基础数据
  GET_OTHERS_FETCH_SUCCESS: Symbol('GET_OTHERS_FETCH_SUCCESS'), // api请求后，请求数据取代store数据
  editUserName: Symbol('editUserName'), // 修改姓名
  editPassword: Symbol('editPassword'), // 修改密码
  editPhone: Symbol('editPhone'), // 修改电话
  SEND_CODE_SAGA: Symbol('SEND_CODE_SAGA'), // 发送验证码
  SEND_CODE_SUCCESS : Symbol('SEND_CODE_SUCCESS'), 
  PHONE_CODE_REGISTER_FAIL: Symbol('PHONE_CODE_REGISTER_FAIL'),
  PHONE_CODE_CHECK_SAGA : Symbol('PHONE_CODE_CHECK_SAGA'),
}