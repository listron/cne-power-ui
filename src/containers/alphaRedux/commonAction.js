

export const commonAction = {
  COMMON_FETCH: Symbol('COMMON_FETCH'),
  changeCommonStore: Symbol('changeCommonStore'),
  CHANGE_COMMON_STORE: Symbol('CHANGE_COMMON_STORE'),
  getStations: Symbol('getStations'),
  //获取所有设备类型，用户权限相关
  getDeviceTypes: Symbol('getDeviceTypes'),
  //获取某电站下所有设备类型
  getStationDeviceTypes: Symbol('getStationDeviceTypes'),
  getStationDeviceModel: Symbol('getStationDeviceModel'), // 获取设备型号
  getStationDevicePoints: Symbol('getStationDevicePoints'), // 获取设备测点
  getDevices: Symbol('getDevices'),
  getPartition: Symbol('getPartition'),
  REFRESHTOKEN_SAGA: Symbol('REFRESHTOKEN_SAGA'), //refreshToken -get 

  getAllDepartment: Symbol('getAllDepartment'), // 获取企业下所有部门(含层级关系);
  GET_COMMON_FETCH_SUCCESS: Symbol('GET_COMMON_FETCH_SUCCESS'), // 普通api请求成功
  getSliceDevices: Symbol('getSliceDevices'),//获取光伏截取数据
  findDeviceExist: Symbol('findDeviceExist'), // 验证设备是否存在
}

