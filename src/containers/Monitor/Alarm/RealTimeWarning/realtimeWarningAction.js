export const realtimeWarningAction={
  changeRealtimeWarningStore: Symbol('MonitorchangeRealtimeWarningStore'), // 改变reducer参数
  resetRealtimeWarninStore: Symbol('MonitorresetRealtimeWarninStore'), // 发起重置数据请求
  getRealtimeWarningStatistic:Symbol('MonitorgetRealtimeWarningStatistic'),//获取预警的告警统计
  getRealtimeWarning:Symbol('MonitorgetRealtimeWarning'),//获取实时预警的列表
  transferWarning:Symbol('MonitortransferWarning'),//转工单
  HandleRemoveWarning:Symbol('MonitorHandleRemoveWarning'),//手动解除
}