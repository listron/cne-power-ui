

export const otherAction = {
  OTHER_FETCH: Symbol('OTHER_FETCH'), //loading状态管理
  CHANGE_OTHER_STORE_SAGA: Symbol('CHANGE_OTHER_STORE_SAGA'), // 触发store基础数据改变
  CHANGE_OTHER_STORE: Symbol('CHANGE_OTHER_STORE'), // 替换改变other store基础数据
  GET_OTHER_FETCH_SUCCESS: Symbol('GET_OTHER_FETCH_SUCCESS'), // api请求后，请求数据取代store数据

  EDIT_PASSWORD_SAGA : Symbol('EDIT_PASSWORD_SAGA'), // 修改密码
}
