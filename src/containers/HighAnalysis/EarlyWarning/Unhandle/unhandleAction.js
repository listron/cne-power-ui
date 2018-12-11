

export const unhandleAction = {
  unhadleFetch: Symbol('unhadleFetch'), // loading
  getUnhandleFetchSuccess: Symbol('getUnhandleFetchSuccess'),
  changeUnhandleStoreSaga: Symbol('changeUnhandleStoreSaga'), // 改变reducer参数
  changeUnhandleStore: Symbol('changeUnhandleStore'), // 替换reducer参数
  getUnhandleList: Symbol('getUnhandleList'), // 获取待预警列表
  toorder: Symbol('toorder'), // 预警转工单
  ignoreList: Symbol('ignoreList'), // 忽略预警
  getForewarningDetail: Symbol('getForewarningDetail'), // 预警信息
  getSequencechart: Symbol('getSequencechart'), // 时序图
  getMatrixlist: Symbol('getMatrixlist'), // 时序图

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





