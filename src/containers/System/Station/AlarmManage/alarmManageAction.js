


export const alarmManageAction = {
  ALARM_MANAGE_FETCH: Symbol('ALARM_MANAGE_FETCH'), // loading
  CHANGE_ALARM_MANAGE_STORE_SAGA: Symbol('CHANGE_ALARM_MANAGE_STORE_SAGA'), // 改变reducer参数
  CHANGE_ALARM_MANAGE_STORE: Symbol('CHANGE_ALARM_MANAGE_STORE'), // 替换reducer参数

  GET_ALARM_MANAGE_FETCH_SUCCESS: Symbol('GET_ALARM_MANAGE_FETCH_SUCCESS'), // 告警事件普通api请求成功

  GET_ALARM_MANAGE_LIST: Symbol('GET_ALARM_MANAGE_LIST'), // 获取告警事件列表
  DELETE_ALARM_MANAGE_LIST: Symbol('DELETE_ALARM_MANAGE_LIST'), // 清空电站内告警事件
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





