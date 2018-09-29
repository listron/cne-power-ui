
import keyMirror from 'keymirror';

module.exports = {
    pointManageAction: keyMirror({
      POINT_MANAGE_FETCH: null, // loading
      CHANGE_POINT_MANAGE_STORE_SAGA: null, //改变reducer参数
      CHANGE_POINT_MANAGE_STORE: null, // 替换reducer参数

      GET_POINT_MANAGE_FETCH_SUCCESS: null, // 测点管理普通api请求成功

      GET_POINT_MANAGE_LIST: null, // 获取测点列表
      GET_POINT_MANAGE_ALL_STATION: null, // 获取所有电站信息=>验证测点是否可以清除。
      DELETE_POINT_MANAGE_LIST: null, // 清空电站测点
  })
}





