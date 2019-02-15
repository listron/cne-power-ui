export const transferFormAction={
  changeTransferFormStore: Symbol('changeTransferFormStore'), // 改变reducer参数
  resetTransferFormStore: Symbol('resetTransferFormStore'), // 发起重置数据请求
  getTransferFormStatistic:Symbol('getTransferFormStatistic'),//获取转工单告警统计
  getTransferForm:Symbol('getTransferForm'),//获取转工单列表
  getTransferInfo:Symbol('getTransferInfo'),//获取转工单列表
}