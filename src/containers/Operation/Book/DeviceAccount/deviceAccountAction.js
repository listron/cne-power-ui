export const deviceAccountAction={
  changeDeviceAccountStore: Symbol('changeDeviceAccountStore'), // 改变reducer参数
  deviceAccountFetchSuccess: Symbol('deviceAccountFetchSuccess'), // loading

  getDeviceAccountList: Symbol('getDeviceAccountList'), // 设备台账列表
  getStationsManufactorsList: Symbol('getStationsManufactorsList'), // 获取电站下的厂家列表
  getDeviceModeList: Symbol('getDeviceModeList'), // 获取厂家下的设备型号列表
  getDeviceAttachments: Symbol('getDeviceAttachments'), // 台账备件列表

  resetStore: Symbol('resetStore'), // 发起重置数据请求
};
