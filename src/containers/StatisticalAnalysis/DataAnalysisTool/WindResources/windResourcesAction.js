export const windResourcesAction = {
  changeWindResourcesStore: Symbol('changeWindResourcesStore'),
  GET_WINDRESOURCES_SUCCESS: Symbol('GET_WINDRESOURCES_SUCCESS'), // 获取api数据成功
  resetStore: Symbol('resetStore'),
  getFrequency: Symbol('getFrequency'), // 获取风能频率图
  getDirections: Symbol('getDirections'), // 获取风能玫瑰图
  getStationDevice: Symbol('getStationDevice'), // 获取电站下的风机列表
  getBigFrequency: Symbol('getBigFrequency'), // 获取放大频率图
  getBigDirections: Symbol('getBigDirections'), // 获取放大玫瑰图
  getFrequencyMax: Symbol('getFrequencyMax'), // 获取风能频率图最大值
};
