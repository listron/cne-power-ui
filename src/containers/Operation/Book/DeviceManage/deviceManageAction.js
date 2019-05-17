

export const deviceManageAction = {
  DEVICE_MANAGE_FETCH: Symbol('DEVICE_MANAGE_FETCH'), // loading
  CHANGE_DEVICE_MANAGE_STORE_SAGA: Symbol('CHANGE_DEVICE_MANAGE_STORE_SAGA'), // 改变reducer参数
  CHANGE_DEVICE_MANAGE_STORE: Symbol('CHANGE_DEVICE_MANAGE_STORE'), // 替换reducer参数

  GET_DEVICE_MANAGE_FETCH_SUCCESS: Symbol('GET_DEVICE_MANAGE_FETCH_SUCCESS'), // 设备管理普通api请求成功

  GET_DEVICE_MANAGE_LIST: Symbol('GET_DEVICE_MANAGE_LIST'), // 获取设备列表
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  addDeviceDetail: Symbol('addDeviceDetail'), // 增加设备详情页数据
  getStationDeviceDetail: Symbol('getStationDeviceDetail'), // 获取设备详情页数据
  getOtherPageDeviceDetail: Symbol('getOtherPageDeviceDetail'), // 获取其他页详情页数据
  editDeviceDetail: Symbol('editDeviceDetail'), // 编辑设备详情页数据
  getConnectDevice: Symbol('getConnectDevice'), // 关联设备数据
  deleteDevice: Symbol('deleteDevice'), // 删除设备信息
  addDeviceType:Symbol('addDeviceType'),
  addDeviceMode:Symbol('addDeviceMode'),
  addPvDeviceMode:Symbol('addPvDeviceMode'),
  checkDeviceName:Symbol('checkDeviceName'),
  checkDeviceType:Symbol('checkDeviceType'),
  checkDeviceMode:Symbol('checkDeviceMode'),
  deleteStationDevice:Symbol('deleteStationDevice'),
  importStationDevice:Symbol('importStationDevice'),
  getStationDeviceType:Symbol('getStationDeviceType'),
  getDeviceFactors:Symbol('getDeviceFactors'),
  getfactorsDeviceMode:Symbol('getfactorsDeviceMode'),//厂家下的设备型号
  getDevicePartInfo:Symbol('getDevicePartInfo'),//获取某设备的部件信息
  getDevicefixRecord:Symbol('getDevicefixRecord'),//获取某设备检修记录
  getDevicehistoryWarning:Symbol('getDevicehistoryWarning'),//获取某设备的历史告警
}





