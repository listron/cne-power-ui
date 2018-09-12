import keyMirror from 'keymirror';

module.exports = {
  commonAction: keyMirror({
    COMMON_FETCH: null,
    CHANGE_COMMON_STORE_SAGA: null,
    CHANGE_COMMON_STORE: null,
    GET_STATIONS_SAGA: null,
    //获取所有设备类型，用户权限相关
    GET_DEVICETYPES_SAGA: null,
    //获取某电站下所有设备类型
    GET_STATION_DEVICETYPES_SAGA: null,
    GET_STATION_DEVICEMODEL_SAGA: null, // 获取设备型号
    GET_STATION_DEVICEPOINT_SAGA: null, // 获取设备测点
    GET_DEVICES_SAGA: null,
    GET_PARTITIONS_SAGA: null,
    REFRESHTOKEN_SAGA: null, //refreshToken -get 

    GET_ALL_DEPARTMENT_SAGA: null, // 获取企业下所有部门(含层级关系);
    GET_COMMON_FETCH_SUCCESS: null, // 普通api请求成功
  })
}

