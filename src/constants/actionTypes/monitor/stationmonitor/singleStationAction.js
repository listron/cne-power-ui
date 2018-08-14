import keyMirror from 'keymirror';

module.exports = {
  singleStationAction: keyMirror({
    GET_SINGLE_STATION_SAGA: null,//	获取单电站实时数据
    SINGLE_STATION_FETCH: null,//loading
    GET_SINGLE_STATION_SUCCESS:null,//请求成功
    CHANGE_SINGLE_STATION_STORE_SAGA: null,//请求改变单电站store数据
    CHANGE_SINGLE_STATION_STORE: null,//改变单电站store数据成功
    GET_STATION_LIST_SAGA: null,//获取电站列表
  })
}