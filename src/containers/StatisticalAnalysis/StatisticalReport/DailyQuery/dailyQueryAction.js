export const dailyQueryAction = {
  changeDailyQueryStore: Symbol('changeDailyQueryStore'),
  GET_DAILYQUERY_SUCCESS: Symbol('GET_DAILYQUERY_SUCCESS'), // 获取api数据成功
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getQuota: Symbol('getQuota'), // 获取关键指标
};
