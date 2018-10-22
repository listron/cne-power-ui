export const stationContrastAction = {
  stationContrastLoading: Symbol('stationContrastLoading'), // loading
  changeStationContrastStore: Symbol('changeStationContrastStore'), // store变化
  toChangeStationContrastStore: Symbol('toChangeStationContrastStore'), // 发起改变store
  resetStationContrastStore: Symbol('resetStationContrastStore'), // reset store数据
  resetStationContrastStoreSuccess: Symbol('resetStationContrastStoreSuccess'), // reset store数据
  
  stationContrastFetchSuccess: Symbol('stationContrastFetchSuccess'), // api成功调用
  
  getStationContrast: Symbol('getStationContrast'), // 获取两个电站对比内容
  getStationContrastDetail: Symbol('getStationContrastDetail'), // 获取两电站列对比详情echarts图
  
} 