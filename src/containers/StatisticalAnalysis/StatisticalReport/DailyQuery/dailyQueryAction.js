export const dailyQueryAction = {
  changeDailyQueryStore: Symbol('changeDailyQueryStore'),
  GET_DAILYQUERY_SUCCESS: Symbol('GET_DAILYQUERY_SUCCESS'), // 获取api数据成功
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getQuota: Symbol('getQuota'), // 获取关键指标
  getFault: Symbol('getFault'), // 获取故障类型
  getQuotaList: Symbol('getQuotaList'), // 关键指标列表
  getFaultList: Symbol('getFaultList'), // 获取故障信息列表
  getLimitList: Symbol('getLimitList'), // 获取限电信息列表
};
