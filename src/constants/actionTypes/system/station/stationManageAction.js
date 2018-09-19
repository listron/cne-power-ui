
import keyMirror from 'keymirror';

module.exports = {
  stationManageAction: keyMirror({
    STATION_MANAGE_FETCH: null, // loading
    CHANGE_STATION_MANAGE_STORE_SAGA: null, // 改变reducer参数
    CHANGE_STATION_MANAGE_STORE: null, // 替换reducer参数

    GET_STATION_MANAGE_LIST: null, // 获取电站列表
    GET_STATION_MANAGE_DETAIL: null, // 获取电站详情
    EDIT_STATION_MANAGE_DETAIL: null, // 编辑电站详情
    DELET_STATION_MANAGE: null, // 删除电站(及以下设备))所有信息
    SET_STATION_MANAGE_DEPARTMENT: null, // 为指定电站分配部门
    GET_OTHER_PAGE_STATION_MANAGE_DETAIL: null, // 详情翻页请求下一页/前一页详情
    GET_ALL_STATION_MANAGE_BASE_INFO: null, // 获取用户所在企业下所有电站(与token无关)

    GET_STATION_MANAGE_FETCH_SUCCESS: null, // 电站管理普通api请求成功
  })
}





