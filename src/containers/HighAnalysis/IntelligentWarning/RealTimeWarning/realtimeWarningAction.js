export const realtimeWarningAction={
  changeRealtimeWarningStore: Symbol('changeRealtimeWarningStore'), // 改变reducer参数
  resetRealtimeWarninStore: Symbol('resetRealtimeWarninStore'), // 发起重置数据请求
  getRealtimeWarningStatistic:Symbol('getRealtimeWarningStatistic'),//获取预警的告警统计
  getRealtimeWarning:Symbol('getRealtimeWarning'),//获取实时预警的列表
  transferWarning:Symbol('transferWarning'),//转工单
  HandleRemoveWarning:Symbol('HandleRemoveWarning'),//手动解除
}