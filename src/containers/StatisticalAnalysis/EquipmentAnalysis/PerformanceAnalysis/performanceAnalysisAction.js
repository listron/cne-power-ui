export const performanceAnalysisAction = {

  PERFORMANCEANALYSIS_FETCH: Symbol('PERFORMANCEANALYSIS_FETCH'),//loading
  GET_PERFORMANCEANALYSIS_FETCH_SUCCESS: Symbol('GET_PERFORMANCEANALYSIS_FETCH_SUCCESS'),//设备性能分析普通api请求成功
  CHANGE_PERFORMANCEANALYSIS_STORE: Symbol('CHANGE_PERFORMANCEANALYSIS_STORE'),//替换reducer参数
  resetStore:Symbol('resetStore'),
  getEquipmentSelection: Symbol('getEquipmentSelection'),//获取设备名称

  getEleLineCode: Symbol('getEleLineCode'),//集成线路接口
  getconversioneff: Symbol('getconversioneff'),//转换效率
  getconversioneffContrast: Symbol('getconversioneffContrast'),//转换效率对比
  getHours: Symbol('getHours'),//等效小时数、故障次数、故障时长
  getHoursContrast: Symbol('getHoursContrast'),//等效小时数、故障次数、故障时长对比
  getAvailability: Symbol('getAvailability'),//利用率及损失电量
  getAvailabilityContrast: Symbol('getAvailabilityContrast'),//利用率及损失电量对比

  getPerformance: Symbol('getPerformance'),//发电性能
  getFault: Symbol('getFault'),//故障情况
  getPerformanceContrast: Symbol('getPerformanceContrast'),//发电性能对比
  getFaultContrast: Symbol('getFaultContrast'),//故障情况对比
  getDeviceModels:Symbol('getDeviceModels'),//两种逆变器
  getEleDeviceData:Symbol('getEleDeviceData'),//集电线路下的设备型号和设备类型数据



}