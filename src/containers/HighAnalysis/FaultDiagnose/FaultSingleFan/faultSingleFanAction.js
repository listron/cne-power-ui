export const faultSingleFanAction = {
  changeSingleFanStore: Symbol('changeSingleFanStore'), // 替换reducer参数
  fetchSingleFanSuccess: Symbol('fetchSingleFanSuccess'), // 请求成功

  getDownloadFile:Symbol('getDownloadFile'), // 下载
  getResetTask:Symbol('getDownloadFile'), // 重新执行
  getFaultInfo:Symbol('getFaultInfo'), // 获取故障预警任务详情
  getFaultReport:Symbol('getFaultReport'), // 历史预警报告。。。
  getStandAloneList:Symbol('getStandAloneList'), // 获取单风机自适应模块检测结果
  getSimilarityList:Symbol('getSimilarityList'), // 获取风机相似性结果
  getAllFanResultList:Symbol('getAllFanResultList'), // 获取多机协同模块检测结果-严重程度及识别（所有风机）
  getTenMinutesBefore:Symbol('getTenMinutesBefore'), // 获取风机10分钟数据-前驱温度
  getTenMinutesAfter:Symbol('getTenMinutesAfter'), // 获取风机10分钟数据-后驱温度
  getTenMinutesDiff:Symbol('getTenMinutesDiff'), // 获取风机10分钟数据-温度差

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
