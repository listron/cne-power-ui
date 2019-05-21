export const historyWarnAction = {
  changeHistoryWarnStore: Symbol('changeHistoryWarnStore'), // 替换reducer参数
  fetchHistoryWarnSuccess: Symbol('fetchHistoryWarnSuccess'), // 请求成功

  getFaultWarnHistory: Symbol('getFaultWarnHistory'), // 获取历史预警列表

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
