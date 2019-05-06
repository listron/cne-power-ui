export const assetConfigAction={
  changeAssetConfigStore: Symbol('changeAssetConfigStore'), // 改变reducer参数
  resetAssetConfigStore: Symbol('resetAssetConfigStore'), // 发起重置数据请求
  getAssetConfigList: Symbol('getAssetConfigList'), // 请求报表列表
}