export const powerReportAction={
  changePowerReportStore: Symbol('MonitorchangePowerReportStore'), // 改变reducer参数
  resetPowerReportStore: Symbol('MonitorresetPowerReportStore'), // 发起重置数据请求
  getPowerReportList: Symbol('MonitorgetPowerReportList'), // 请求报表列表
}