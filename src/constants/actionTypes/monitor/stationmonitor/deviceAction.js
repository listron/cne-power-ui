import keyMirror from 'keymirror';

module.exports = {
  deviceAction: keyMirror({
    MONITOR_DEVICE_FETCH: null, // loading
    CHANGE_DEVICE_MONITOR_STORE_SAGA: null, // 改变reducer参数
    CHANGE_DEVICE_MONITOR_STORE: null, // 替换reducer参数
    GET_DEVICE_FETCH_SUCCESS: null, // 单设备详情普通api请求成功

    GET_INVERTER_DETAIL_SAGA: null, // 获取组串式逆变器详情
    GET_INVERTER_TENMIN_SAGA: null, // 组串式逆变器10min时序图

    GET_CONFLUENCEBOX_DETAIL_SAGA: null, //	汇流箱详情
    GET_CONFLUENCEBOX_TENMIN_SAGA: null, //	汇流箱10min时序图

    GET_TRANSFORMER_DETAIL_SAGA: null, //	箱变详情
    GET_TRANSFORMER_TENMIN_SAGA: null, //	箱变10min时序图

    GET_WEATHERSTATION_DETAIL_SAGA: null, //	气象站详情
    GET_MONITOR_POINT_SAGA: null, // 设备测点数据

    GET_DEVICE_ALARM_SAGA: null, // 获取单设备告警详情
  })
}
