import keyMirror from 'keymirror';

module.exports = {
  allStationAction: keyMirror({
    GET_ALL_MONITORSTATION_SAGA: null,//	获取多电站实时数据列表
    ALL_MONITORSTATION_FETCH: null,//loading
    GET_MONITORSTATION_FETCH_SUCCESS: null,//请求成功
    CHANGE_MONITORSTATION_STORE_SAGA: null,
    CHANGE_MONITORSTATION_STORE: null,

    // GET_STATION_DETAIL_SAGA: null, //获取单电站详情
   
    // SINGLE_STATION_FETCH:null,
    // GET_SINGLE_STATION_FETCH_SUCCESS:null,


//wind
    GET_WIND_MONITORSTATION_SAGA: null,
    WIND_MONITORSTATION_FETCH: null,
    GET_WIND_MONITORSTATION_FETCH_SUCCESS: null,

//pv
    GET_PV_MONITORSTATION_SAGA: null,
    PV_MONITORSTATION_FETCH: null,
    GET_PV_MONITORSTATION_FETCH_SUCCESS: null,
  })
}
