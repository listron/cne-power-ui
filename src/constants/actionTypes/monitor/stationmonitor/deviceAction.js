import keyMirror from 'keymirror';

module.exports = {
  deviceAction: keyMirror({
    MONITOR_DEVICE_FETCH: null, // loading
    CHANGE_DEVICE_MONITOR_STORE_SAGA: null, // 改变reducer参数
    CHANGE_DEVICE_MONITOR_STORE: null, // 替换reducer参数
    GET_DEVICE_FETCH_SUCCESS: null, // 单设备详情普通api请求成功

    GET_DEVICE_DATA_SAGA: null,  //单设备数据请求
  })
}
