import keyMirror from 'keymirror';

module.exports = {
  allStationAction: keyMirror({
    GET_ALL_MONITORSTATION_SAGA: null,//	获取多电站实时数据列表
    MONITORSTATION_FETCH: null,//loading
    GET_MONITORSTATION_FETCH_SUCCESS:null,//请求成功
    CHANGE_MONITORSTATION_STORE_SAGA: null,
    CHANGE_MONITORSTATION_STORE: null,
  
  })
}

