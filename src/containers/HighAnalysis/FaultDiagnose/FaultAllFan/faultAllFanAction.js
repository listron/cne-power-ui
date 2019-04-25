export const faultAllFanAction = {
  changeFaultAllFanStore: Symbol('changeFaultAllFanStore'), // 替换reducer参数
  fetchFaultAllFanSuccess: Symbol('fetchFaultAllFanSuccess'), // 请求成功

  getStationDeviceList:Symbol('getStationDeviceList'), // 获取单电站所有风机
  getDownloadFile:Symbol('getDownloadFile'), // 获取单电站所有风机
  getResetTask:Symbol('getDownloadFile'), // 重新执行
  getFaultInfo:Symbol('getFaultInfo'), // 故障日期。。。
  getFaultReport:Symbol('getFaultReport'), // 历史预警报告。。。
  getStandAloneList:Symbol('getStandAloneList'), // 获取单风机自适应模块检测结果
  getSimilarityList:Symbol('getSimilarityList'), // 获取风机相似性结果
  getAllFanResultList:Symbol('getAllFanResultList'), // 获取多机协同模块检测结果-严重程度及识别（所有风机）

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
