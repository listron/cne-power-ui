export const deviceStatusAction = {
  changeDeviceStatusStore: Symbol('MonitorchangeDeviceStatusStore'), // 改变reducer参数
  resetDeviceStatusStore: Symbol('MonitorresetDeviceStatusStore'), // 发起重置数据请求
  getDeviceStatusList: Symbol('MonitorgetDeviceStatusList'), // 请求报表列表
  getDeviceStatusDetail: Symbol('MonitorgetDeviceStatusDetail'), // 请求报表列表

}