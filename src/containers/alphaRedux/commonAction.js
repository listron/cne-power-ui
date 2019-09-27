

export const commonAction = {
  COMMON_FETCH: Symbol('COMMON_FETCH'),
  changeCommonStore: Symbol('changeCommonStore'),
  CHANGE_COMMON_STORE: Symbol('CHANGE_COMMON_STORE'),
  getStations: Symbol('getStations'), // 获取电站
  getDeviceTypes: Symbol('getDeviceTypes'), // 获取用户下所有设备类型
  getMonitorDataUnit: Symbol('getMonitorDataUnit'), //获取电站监控的数据单位以及精确值

  getDevices: Symbol('getDevices'),
  getPartition: Symbol('getPartition'),
  getStationBelongTypes: Symbol('getStationBelongTypes'), // 获取电站可能的所属的各种分类信息
  getStationTargetInfo: Symbol('getStationTargetInfo'), // 获取电站指定分类信息，省市县，新的分类，消纳，等。
  REFRESHTOKEN_SAGA: Symbol('REFRESHTOKEN_SAGA'), //refreshToken -get 

  getAllDepartment: Symbol('getAllDepartment'), // 获取企业下所有部门(含层级关系);
  getStationOfEnterprise: Symbol('getStationOfEnterprise'), // 获取企业下所有电站信息=>与用户权限无关
  GET_COMMON_FETCH_SUCCESS: Symbol('GET_COMMON_FETCH_SUCCESS'), // 普通api请求成功
  getSliceDevices: Symbol('getSliceDevices'), //获取光伏截取数据
  getMatrixDevices: Symbol('getMatrixDevices'), // 获取同一设备类型同属第一方阵的所有设备。。
  findDeviceExist: Symbol('findDeviceExist'), // 验证设备是否存在
  getLostGenType: Symbol('getLostGenType'), // 查询所有故障类型

  getStationDeviceTypes: Symbol('getStationDeviceTypes'), // 电站下设备类型获取
  getDeviceModel: Symbol('getDeviceModel'), // 电站设备类型下设备型号获取
  getPoints: Symbol('getPoints'), // 电站下测点
  getDictionaryInfo: Symbol('getDictionaryInfo'), //获取覆盖类型、并网电压等级、所属电网（区域）忽略原因列表

  getWeather: Symbol('getWeather'), // 获取天气列表数据
  downLoadFile: Symbol('downLoadFile'), // 下载文件

  resetCommonStore: Symbol('resetCommonStore'), // 重制公共文件
  getRegion: Symbol('getRegion'), //获取用户权限的电站区域
  getRegionStation: Symbol('getRegionStation'), //获取用户权限的电站区域下的电站
  getStationDevicemode: Symbol('getStationDevicemode'), //获取用户权限的电站区域下的电站下的对应型号
  getRegionStationDevice: Symbol('getRegionStationDevice'), //获取用户权限的电站区域下电站下的对应设备
  getStationTypeDeviceTypes: Symbol('getStationTypeDeviceTypes'), //获取电站类型对应设备

};

