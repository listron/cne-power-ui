export const powerLostAction = {
  changePowerLostStore: Symbol('MonitorchangePowerLostStore'), // 改变reducer参数
  resetPowerLostStore: Symbol('MonitorresetPowerLostStore'), // 发起重置数据请求
  getPowerLostList: Symbol('MonitorgetPowerLostList'), // 请求报表列表
}