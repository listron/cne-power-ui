import keyMirror from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/keymirror';

module.exports = {
  singleStationAction: keyMirror({
    GET_SINGLE_MONITORSTATION_SAGA: null,//	获取单电站实时数据
    SINGLE_STATION_FETCH: null,//loading
    GET_SINGLE_MONITORSTATION_SUCCESS:null,//请求成功
    CHANGE_SINGLE_MONITORSTATION_STORE_SAGA: null,//请求改变单电站store数据
    CHANGE_SINGLE_MONITORSTATION_STORE: null,//改变单电站store数据成功
    GET_STATION_LIST_SAGA: null,//获取电站列表
  })
}