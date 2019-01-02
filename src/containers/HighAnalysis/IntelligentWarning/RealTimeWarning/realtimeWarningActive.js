export const realtimeWarningActive={
  changeRealtimeWarningStore: Symbol('changeRealtimeWarningStore'), // 改变reducer参数
  resetRealtimeWarninStore: Symbol('resetRealtimeWarninStore'), // 发起重置数据请求
  getRealtimeWarningStatistic:Symbol('getRealtimeWarningStatistic'),//获取预警的告警统计
}