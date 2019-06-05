export const partInfoAction = {
  changePartInfoStore: Symbol('changePartInfoStore'), // 改变reducer参数
  resetPartInfoStore: Symbol('resetPartInfoStore'), // 发起重置数据请求
  getDeviceTypeList: Symbol('getDeviceTypeList'), // 电站下设备类型列表
  getDeviceComList: Symbol('getDeviceComList'), // 设备下组件列表
  addPartInfo: Symbol('addPartInfo'), // 添加组件信息
  editPartInfo: Symbol('editPartInfo'), // 添加组件信息
  getDetailPartInfo: Symbol('getDetailPartInfo'), // 组件信息详情
  deletePartInfo: Symbol('deletePartInfo'), // 删除组件信息
  getPartsAssetTree: Symbol('getPartsAssetTree'), //生产资产树
  getPartsFactorsList: Symbol('getPartsFactorsList'),//组件厂家列表
  getfactorsPartsMode: Symbol('getfactorsPartsMode'),//厂家下组件型号
  addPartsFactors: Symbol('addPartsFactors'),//新建组件厂家
  addPartsModes: Symbol('addPartsModes'),//新建组件型号
  getDevicePartInfo: Symbol('getPartDevicePartInfo'),////通过设备获得组件详情树
  copyPartInfo: Symbol('copyPartInfo'),//复制组件

}