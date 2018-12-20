export const warningAction = {
  WARNING_MANAGE_FETCH: Symbol('WARNING_MANAGE_FETCH'), // loading
  WARNING_MANAGE_FETCHZ_SUCESS: Symbol('WARNING_MANAGE_FETCHZ_SUCESS'), // loading
  CHANGE_WARNING_STORE_SAGA: Symbol('CHANGE_WARNING_STORE_SAGA'), // 改变reducer参数
  CHANGE_WARNING_STORE: Symbol('CHANGE_WARNING_STORE'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getSeriesData: Symbol('getSeriesData'),//获取低效组串数据
  addSeriesData: Symbol('addSeriesData'),//修改低效组串数据
  getCleaningData: Symbol('getCleaningData'),//获取清洗模型数据
  addCleaningData: Symbol('addCleaningData'),//修改清洗模型数据
}