export const warningAction = {
  changeWarnStore: Symbol('changeWarnStore'), // 替换reducer参数  
  changeWarnStoreSaga: Symbol('changeWarnStoreSaga'), // 替换reducer参数  
  getSeriesData: Symbol('getSeriesData'),//获取低效组串数据
  addSeriesData: Symbol('addSeriesData'),//修改低效组串数据
  getCleaningData: Symbol('getCleaningData'),//获取清洗模型数据
  addCleaningData: Symbol('addCleaningData'),//修改清洗模型数据

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}