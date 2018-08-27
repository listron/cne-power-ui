import keyMirror from 'keymirror';

module.exports = {
  alarmAction: keyMirror({
    ALARM_FETCH: null,//loading
    GET_REALTIME_ALARM_SAGA: null,//	获取多电站实时告警列表
    GET_HISTORY_ALARM_SAGA: null,//获取历史告警列表
    GET_STATIONS_ALARM_STATISTIC_SAGA: null,//获取多电站告警统计
    GET_SINGLESTATION_ALARM_STATISTIC_SAGA: null,//获取单电站告警统计
    CHANGE_ALARM_STORE_SAGA: null,
    CHANGE_ALARM_STORE: null,
    GET_ALARM_FETCH_SUCCESS: null,
    TRANSFER_ALARM_SAGA: null,
    RELIEVE_ALARM_SAGA: null,
    GET_ALARM_NUM_SAGA: null,
    GET_TICKET_INFO_SAGA: null,
    GET_RELIEVE_INFO_SAGA: null,
    RESET_ALARM_SAGA: null,
    RESET_ALARM: null,
  })
}