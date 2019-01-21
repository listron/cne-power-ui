export const historyWarningActive={
  changeHistoryWarningStore: Symbol('MonitorchangeHistoryWarningStore'), // 改变reducer参数
  resetHistoryWarningStore: Symbol('MonitorresetHistoryWarningStore'), // 发起重置数据请求
  getHistoryarningList: Symbol('MonitorgetHistoryarningList'), // 历史告警列表
  getHistoryTicketInfo: Symbol('MonitorgetHistoryTicketInfo'), // 历史工单详情
  getHistoryRelieveInfo: Symbol('MonitorgetHistoryRelieveInfo'), // 手动解除
}