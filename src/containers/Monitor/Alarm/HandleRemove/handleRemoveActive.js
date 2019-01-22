export const handleRemoveActive={
  changeHandleRemoveStore: Symbol('MonitorchangeHandleRemoveStore'), // 改变reducer参数
  resetHandleRemoveStore: Symbol('MonitorresetHandleRemoveStore'), // 发起重置数据请求
  getHandleRemoveStatistic:Symbol('MonitorgetHandleRemoveStatistic'),//获取预警的告警统计
  getHandleRemoveList:Symbol('MonitorgetHandleRemoveList'),//获取手动解除的列表
  getHandleRemoveTransfer:Symbol('MonitorgetHandleRemoveTransfer'),//转工单
  cancleHandleRemove:Symbol('MonitorcancleHandleRemove'),//取消手动解除
  getHandleRemoveInfo:Symbol('getHandleRemoveInfo'),//手动解除详处理情
}