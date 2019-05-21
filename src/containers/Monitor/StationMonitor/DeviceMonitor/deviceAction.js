

export const deviceAction = {
  MONITOR_DEVICE_FETCH: Symbol('MONITOR_DEVICE_FETCH'), // loading
  CHANGE_DEVICE_MONITOR_STORE_SAGA: Symbol('CHANGE_DEVICE_MONITOR_STORE_SAGA'), // 改变reducer参数
  CHANGE_DEVICE_MONITOR_STORE: Symbol('CHANGE_DEVICE_MONITOR_STORE'), // 替换reducer参数
  GET_DEVICE_FETCH_SUCCESS: Symbol('GET_DEVICE_FETCH_SUCCESS'), // 单设备详情普通api请求成功

  GET_DEVICE_DATA_SAGA: Symbol('GET_DEVICE_DATA_SAGA'),  //单设备数据请求
  GET_NORMAL_DEVICE_DATA_SAGA: Symbol('GET_NORMAL_DEVICE_DATA_SAGA'),  //普遍设备(逆变器，汇流箱，箱变)数据请求
  getIntegrateData: Symbol('getIntegrateData'), // 集电线路10min请求
  getBoosterData: Symbol('getBoosterData'), // 集电线路10min请求
  GET_DEVICE_MONITOR_TEN_MIN_DATA_SAGA: Symbol('GET_DEVICE_MONITOR_TEN_MIN_DATA_SAGA'), // 单个设备10min时序图数据请求
  GET_WEATHERSTATION_DATA_SAGA: Symbol('GET_WEATHERSTATION_DATA_SAGA'),  //气象站数据请求
  RESET_DEVICE_MONITOR_STORE: Symbol('RESET_DEVICE_MONITOR_STORE'),
  RESET_DEVICE_MONITOR_STORE_SUCCESS: Symbol('RESET_DEVICE_MONITOR_STORE_SUCCESS'),
  getwindturbineData: Symbol('getwindturbineData'), // 单风机详情
  getSequencechartData: Symbol('getSequencechartData'), // 单风机图表数据
  getWindDeviceCharts: Symbol('getWindDeviceCharts'), // 单风机图表数据(时序图和散点图)
  stopWindDeviceCharts: Symbol('stopWindDeviceCharts'), // 单风机图表数据(时序图和散点图)
  getWindDeviceRealData: Symbol('getWindDeviceRealData'), // 单风机图表数据(10s 数据)


}