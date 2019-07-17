export const assetConfigAction = {
  changeAssetConfigStore: Symbol('changeAssetConfigStore'), // 改变reducer参数
  resetAssetConfigStore: Symbol('resetAssetConfigStore'), // 发起重置数据请求
  getAssetTree: Symbol('getAssetTree'), // 台账生产资产树
  getNodeDetail: Symbol('getNodeDetail'), // 台账生产资产树节点详情
  addAssetNode: Symbol('addAssetNode'), //台账增加生产资产节点
  deleteAssetNode: Symbol('deleteAssetNode'), //台账删除生产资产树
  editAssetNode: Symbol('editAssetNode'), //台账编辑生产资产节点
  getDeviceFactorsList: Symbol('getDeviceFactorsList'), //获取设备厂家列表
  addDeviceFactors: Symbol('addDeviceFactors'), //新建设备厂家
  editDeviceFactors: Symbol('editDeviceFactors'), //编辑设备厂家
  deleteDeviceFactors: Symbol('deleteDeviceFactors'), //删除设备厂家
  getDeviceModesList: Symbol('getDeviceModesList'), //获取设备型号列表
  addDeviceModes: Symbol('addDeviceModes'), //新建设备型号
  editDeviceModes: Symbol('editDeviceModes'), //编辑设备型号
  deleteDeviceModes: Symbol('deleteDeviceModes'), //删除设备型号
  getEnterprisecodes: Symbol('getEnterprisecodes'), //删除设备型号
};
