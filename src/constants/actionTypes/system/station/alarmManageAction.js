
import keyMirror from 'keymirror';

module.exports = {
    alarmManageAction: keyMirror({
      ALARM_MANAGE_FETCH: null, // loading
      CHANGE_ALARM_MANAGE_STORE_SAGA: null, // 改变reducer参数
      CHANGE_ALARM_MANAGE_STORE: null, // 替换reducer参数

      GET_ALARM_MANAGE_FETCH_SUCCESS: null, // 告警事件普通api请求成功
  })
}





