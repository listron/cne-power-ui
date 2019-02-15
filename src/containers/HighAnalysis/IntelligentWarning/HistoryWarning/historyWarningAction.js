export const historyWarningAction={
  changeHistoryWarningStore: Symbol('changeHistoryWarningStore'), // 改变reducer参数
  resetHistoryWarningStore: Symbol('resetHistoryWarningStore'), // 发起重置数据请求
  getHistoryarningList: Symbol('getHistoryarningList'), // 历史告警列表
  getHistoryTicketInfo: Symbol('getHistoryTicketInfo'), // 历史工单详情
  getHistoryRelieveInfo: Symbol('getHistoryRelieveInfo'), // 手动解除
}