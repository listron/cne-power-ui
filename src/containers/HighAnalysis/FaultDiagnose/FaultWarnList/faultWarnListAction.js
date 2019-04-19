export const faultWarnListAction = {
  changeWarnListStore: Symbol('changeWarnListStore'), // 替换reducer参数
  fetchWarnListSuccess: Symbol('fetchWarnListSuccess'), // 请求成功

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
