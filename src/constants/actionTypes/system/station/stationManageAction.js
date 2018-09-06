
import keyMirror from 'keymirror';

module.exports = {
  stationManageAction: keyMirror({
    STATION_MANAGE_FETCH: null, // loading
    CHANGE_STATION_MANAGE_STORE_SAGA: null, // 改变reducer参数
    CHANGE_STATION_MANAGE_STORE: null, // 替换reducer参数

    GET_STATION_MANAGE_LIST: null, // 获取电站列表
    GET_STATION_MANAGE_DETAIL: null, // 获取电站详情
    EDIT_STATION_MANAGE_DETAIL: null, // 编辑电站详情
    SET_STATION_MANAGE_DEPARTMENT: null, // 为指定电站分配部门

    GET_STATION_MANAGE_FETCH_SUCCESS: null, // 电站管理普通api请求成功
  })
}





