export const transferFormAction={
  changeTransferFormStore: Symbol('MonitorchangeTransferFormStore'), // 改变reducer参数
  resetTransferFormStore: Symbol('MonitorresetTransferFormStore'), // 发起重置数据请求
  getTransferFormStatistic:Symbol('MonitorgetTransferFormStatistic'),//获取转工单告警统计
  getTransferForm:Symbol('MonitorgetTransferForm'),//获取转工单列表
  getTransferInfo:Symbol('MonitorgetTransferInfo'),//获取转工单列表
}