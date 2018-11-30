export const stationResourceAnalysisAction = {
 STATIONRESOURCESTATIONDATA_FETCH: Symbol(' STATIONRESOURCESTATIONDATA_FETCH'),//loading
  GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS: Symbol('GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS'),//请求成功 
  CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA: Symbol('CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA'),//改变默认参数
  CHANGE_STATIONRESOURCESTATIONDATA_STORE: Symbol('CHANGE_STATIONRESOURCESTATIONDATA_STORE'),//改变默认参数
  getAllStationAvalibaData:Symbol('getAllStationAvalibaData'), // 默认是否有数据
  getResourcePlan:Symbol('getResourcePlan'), // 生产计划
  getResourceMonthLight:Symbol('getResourceMonthLight'), // 光资源分布 月／日
  getResourceYearLight:Symbol('getResourceYearLight'), // 光资源分布 年
  getResourceMonthWeather:Symbol('getResourceMonthWeather'), // 天气预报 月／年
  getResourceDayWeather:Symbol('getResourceDayWeather'), // 天气预报 日
  getResourcePvCompare:Symbol('getResourcePvCompare'), // 光资源同比
  getResourceYearPvCompare:Symbol('getResourceYearPvCompare'), // 光资源环比
  RESET_STORE:Symbol('RESET_STORE'),
  resetStore:Symbol('resetStore'), // 重置
}
