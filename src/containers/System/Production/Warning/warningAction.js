export const warningAction = {
  changeWarnStore: Symbol('changeWarnStore'), // 替换reducer参数  
  changeWarnStoreSaga: Symbol('changeWarnStoreSaga'), // 替换reducer参数  
  getSeriesData: Symbol('getSeriesData'),//获取低效组串数据
  addSeriesData: Symbol('addSeriesData'),//修改低效组串数据
  getCleaningData: Symbol('getCleaningData'),//获取清洗模型数据
  addCleaningData: Symbol('addCleaningData'),//修改清洗模型数据
  getWarnList: Symbol('getWarnList'),// 预警配置列表
  addWran: Symbol('addWran'),// 预警配置 新增
  modify: Symbol('modify'),// 预警配置 修改
  getDetail: Symbol('getDetail'),// 预警配置 详情
  warnDelete: Symbol('warnDelete'),// 预警配置 删除

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}