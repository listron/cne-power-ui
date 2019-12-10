export const malfunctionAction = {
  changeMalfunctionStore: Symbol('MonitorchangeMalfunctionStore'), // 改变reducer参数
  resetMalfunctionStore: Symbol('MonitorresetMalfunctionStore'), // 发起重置数据请求
  getMalfunctionList: Symbol('MonitorgetMalfunctionList'), // 请求报表列表
  getMalfunctionDetail: Symbol('MonitorgetMalfunctionDetail'), // 请求报表列表
}