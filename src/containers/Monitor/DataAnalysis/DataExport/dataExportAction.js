export const dataExportAction = {
  GET_DATAEXPORT_SUCCESS:Symbol("GET_DATAEXPORT_SUCCESS"), // api请求成功
  changeDataExportStore: Symbol('changeDataExportStore'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 重置数据
  getPointInfo: Symbol('getPointInfo'), // 根据选中电站/设备得到的可选测点信息
  getAvailableDeviceType: Symbol('getAvailableDeviceType'), // 获取设备类型
  getDataExportList: Symbol('getDataExportList'), // 数据导出任务列表
  getAgainDataExport: Symbol('getAgainDataExport'), // 重新生成数据导出任务列表
  getDataExport: Symbol('getDataExport'), // 生成导出任务
  getSecendInterval: Symbol('getSecendInterval'), // // 获取是否有秒级数据
}