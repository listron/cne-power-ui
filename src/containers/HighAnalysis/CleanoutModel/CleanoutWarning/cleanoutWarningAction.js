

export const cleanoutWarningAction = {
  CLEANOUT_WARNING_FETCH: Symbol('CLEANOUT_WARNING_FETCH'), // loading
  GET_CLEANOUT_WARNING_FETCH_SUCCESS: Symbol('GET_CLEANOUT_WARNING_FETCH_SUCCESS'),
  CHANGE_CLEANOUT_WARNING_STORE_SAGA: Symbol('CHANGE_CLEANOUT_WARNING_STORE_SAGA'), // 改变reducer参数
  CHANGE_CLEANOUT_WARNING_STORE: Symbol('CHANGE_CLEANOUT_WARNING_STORE'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





