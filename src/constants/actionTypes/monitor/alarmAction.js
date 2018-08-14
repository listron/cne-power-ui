import keyMirror from 'keymirror';

module.exports = {
  alarmAction: keyMirror({
    ALARM_FETCH: null,//loading
    GET_REALTIME_ALARM_SAGA: null,//	获取多电站实时告警列表
    CHANGE_ALARM_STORE_SAGA: null,
    CHANGE_ALARM_STORE: null,
    GET_ALARM_FETCH_SUCCESS: null
  })
}