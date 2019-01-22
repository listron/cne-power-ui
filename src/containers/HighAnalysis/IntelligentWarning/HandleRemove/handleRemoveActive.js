export const handleRemoveActive={
  changeHandleRemoveStore: Symbol('changeHandleRemoveStore'), // 改变reducer参数
  resetHandleRemoveStore: Symbol('resetHandleRemoveStore'), // 发起重置数据请求
  getHandleRemoveStatistic:Symbol('getHandleRemoveStatistic'),//获取预警的告警统计
  getHandleRemoveList:Symbol('getHandleRemoveList'),//获取手动解除的列表
  getHandleRemoveTransfer:Symbol('getHandleRemoveTransfer'),//转工单
  cancleHandleRemove:Symbol('cancleHandleRemove'),//取消手动解除
  getHandleRemoveInfo:Symbol('getHandleRemoveInfo'),//手动解除详处理情
}