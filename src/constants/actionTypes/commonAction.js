import keyMirror from 'keymirror';

module.exports = {
  commonAction: keyMirror({
    COMMON_FETCH: null,
    CHANGE_COMMON_STORE_SAGA: null,
    CHANGE_COMMON_STORE: null,
    GET_STATIONS_SAGA: null,
    GET_STATIONS_SUCCESS: null,
    GET_STATIONS_FAIL: null,
    //获取所有设备类型，用户权限相关
    GET_DEVICETYPES_SAGA: null,
    GET_DEVICETYPES_SUCCESS: null,
    GET_DEVICETYPES_FAIL: null,
    //获取某电站下所有设备类型
    GET_STATION_DEVICETYPES_SAGA: null,
    GET_STATION_DEVICETYPES_SUCCESS: null,
    GET_STATION_DEVICETYPES_FAIL: null,
    GET_DEVICES_SAGA: null,
    GET_DEVICES_SUCCESS: null,
    GET_DEVICES_FAIL: null,
    GET_PARTITIONS_SAGA: null,
    GET_PARTITIONS_SUCCESS: null,
    GET_PARTITIONS_FAIL: null,
  })
}

