
export const alarmAction = {
  ALARM_FETCH: Symbol('ALARM_FETCH'),//loading
  GET_REALTIME_ALARM_SAGA: Symbol('GET_REALTIME_ALARM_SAGA'),//	获取多电站实时告警列表
  GET_HISTORY_ALARM_SAGA: Symbol('GET_HISTORY_ALARM_SAGA'),//获取历史告警列表
  CHANGE_ALARM_STORE_SAGA: Symbol('CHANGE_ALARM_STORE_SAGA'),
  CHANGE_ALARM_STORE: Symbol('CHANGE_ALARM_STORE'),
  GET_ALARM_FETCH_SUCCESS: Symbol('GET_ALARM_FETCH_SUCCESS'),
  TRANSFER_ALARM_SAGA: Symbol('TRANSFER_ALARM_SAGA'),
  RELIEVE_ALARM_SAGA: Symbol('RELIEVE_ALARM_SAGA'),
  RESET_RELIEVE_ALARM_SAGA: Symbol('RESET_RELIEVE_ALARM_SAGA'),
  GET_ALARM_NUM_SAGA: Symbol('GET_ALARM_NUM_SAGA'),
  GET_TICKET_INFO_SAGA: Symbol('GET_TICKET_INFO_SAGA'),
  GET_RELIEVE_INFO_SAGA: Symbol('GET_RELIEVE_INFO_SAGA'),
  EXPORT_ALARM_STATISTIC_SAGA: Symbol('EXPORT_ALARM_STATISTIC_SAGA'),
  RESET_ALARM_SAGA: Symbol('RESET_ALARM_SAGA'),
  RESET_ALARM: Symbol('RESET_ALARM'),
  

  GET_STATIONS_ALARM_STATISTIC_SAGA: Symbol('GET_STATIONS_ALARM_STATISTIC_SAGA'),//获取多电站告警统计
  GET_SINGLESTATION_ALARM_STATISTIC_SAGA: Symbol('GET_SINGLESTATION_ALARM_STATISTIC_SAGA'),//获取单电站告警统计
  ALARM_STATISTIC_FETCH: Symbol('ALARM_STATISTIC_FETCH'),//loading
  RESET_ALARM_STATISTIC_SAGA: Symbol('RESET_ALARM_STATISTIC_SAGA'),
  RESET_ALARM_STATISTIC: Symbol('RESET_ALARM_STATISTIC'),
  GET_ALARM_STATISTIC_FETCH_SUCCESS: Symbol('GET_ALARM_STATISTIC_FETCH_SUCCESS'),
  CHANGE_ALARM_STATISTIC_STORE_SAGA: Symbol('CHANGE_ALARM_STATISTIC_STORE_SAGA'),
  CHANGE_ALARM_STATISTIC_STORE: Symbol('CHANGE_ALARM_STATISTIC_STORE'),
}