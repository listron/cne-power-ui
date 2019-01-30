

export const historyWarnAction = {
  historyWarnFetch: Symbol('historyWarnFetch'), // loading
  getHistoryWarnFetchSuccess: Symbol('getHistoryWarnFetchSuccess'),
  changeHistoryWarnStoreSaga: Symbol('changeHistoryWarnStoreSaga'), // 改变reducer参数
  changeHistoryWarnStore: Symbol('changeHistoryWarnStore'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  getHistoryWarnList: Symbol('getHistoryWarnList'), // 获取历史预警列表数据
  getHistoryWarnMatrixList: Symbol('getHistoryWarnMatrixList'), // 获取历史预警方阵数据
  getSequencechart: Symbol('getSequencechart'), // 获取时序图的图表
}





