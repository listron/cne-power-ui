export const partInfoAction = {
  changePartInfoStore: Symbol('changePartInfoStore'), // 改变reducer参数
  resetPartInfoStore: Symbol('resetPartInfoStore'), // 发起重置数据请求
  getDeviceTypeList: Symbol('getDeviceTypeList'), // 电站下设备类型列表
  getDeviceComList: Symbol('getDeviceComList'), // 设备下组件列表
  addPartInfo: Symbol('addPartInfo'), // 添加组件信息
  editPartInfo: Symbol('editPartInfo'), // 添加组件信息
  getDetailPartInfo: Symbol('getDetailPartInfo'), // 组件信息详情
  deletePartInfo: Symbol('deletePartInfo'), // 删除组件信息

  
}