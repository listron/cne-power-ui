export const windResourcesAction = {
  changeWindResourcesStore: Symbol('changeWindResourcesStore'),
  GET_WINDRESOURCES_SUCCESS: Symbol('GET_WINDRESOURCES_SUCCESS'), // 获取api数据成功
  resetStore: Symbol('resetStore'),
  getFrequency: Symbol('getFrequency'), // 获取风能频率图
  getStationDevice: Symbol('getStationDevice'), // 获取电站下的风机列表
  getBigFrequency: Symbol('getBigFrequency'), // 获取放大频率图
};
