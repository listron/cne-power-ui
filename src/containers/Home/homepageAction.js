

export const homepageAction = {
  LOADING: Symbol('LOADING'),
  GET_HOMEPAGE_FETCH_SUCCESS: Symbol('GET_HOMEPAGE_FETCH_SUCCESS'), // api请求成功
  changeHomepageStore: Symbol('changeHomepageStore'), // 改变stort
  homepageReset: Symbol('homepageReset'), // 重置数据

  getRealTimeData: Symbol('getRealTimeData'), // 实时监控数据
  getCompleteRate: Symbol('getCompleteRate'), // 完成率
  getEnergySaving: Symbol('getEnergySaving'), // 节能减排
  getMonthPower: Symbol('getMonthPower'), // 每月发电量
  getEqpHours: Symbol('getEqpHours'), // 等效利用小时数
  getFaultNumber: Symbol('getFaultNumber'), // 故障台次
  getMapStation: Symbol('getMapStation'), // 地图坐标及统计
  getSingleStation: Symbol('getSingleStation'), // 地图内单电站信息
  getAlarmList: Symbol('getAlarmList'), // 告警列表
  getOutputDiagram: Symbol('getOutputDiagram'), // 出力图表
  getOperationInfo: Symbol('getOperationInfo'), // 运维情况
  getUnhandleList: Symbol('getUnhandleList'), // 获取待处理预警列表
};





