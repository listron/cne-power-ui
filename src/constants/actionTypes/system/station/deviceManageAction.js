
import keyMirror from 'keymirror';

module.exports = {
    deviceManageAction: keyMirror({
      DEVICE_MANAGE_FETCH: null, // loading
      CHANGE_DEVICE_MANAGE_STORE_SAGA: null, // 改变reducer参数
      CHANGE_DEVICE_MANAGE_STORE: null, // 替换reducer参数

      GET_DEVICE_MANAGE_FETCH_SUCCESS: null, // 设备管理普通api请求成功
  })
}





