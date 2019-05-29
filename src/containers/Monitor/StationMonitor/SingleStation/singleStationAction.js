

export const singleStationAction = {
  GET_SINGLE_STATION_SAGA: Symbol('GET_SINGLE_STATION_SAGA'),//	获取单电站实时数据

 
  GET_SINGLE_STATION_FAIL: Symbol('GET_SINGLE_STATION_FAIL'),//请求失败
  
  GET_STATION_LIST_SAGA: Symbol('GET_STATION_LIST_SAGA'),//获取电站列表
  GET_CAPABILITY_DIAGRAM_SAGA: Symbol('GET_CAPABILITY_DIAGRAM_SAGA'),//获取出力图数据
  GET_MONITOR_POWER_SAGA: Symbol('GET_MONITOR_POWER_SAGA'),//获取理论发电量 实际发电量数据
  GET_OPERATOR_LIST_SAGA: Symbol('GET_OPERATOR_LIST_SAGA'),//运维人员列表
  GET_WEATHER_LIST_SAGA: Symbol('GET_WEATHER_LIST_SAGA'),//未来天气数据
  GET_ALARM_LIST_SAGA: Symbol('GET_ALARM_LIST_SAGA'),//告警数统计
  GET_WORK_LIST_SAGA: Symbol('GET_WORK_LIST_SAGA'),//工单数统计
  GET_DEVICE_TYPE_FLOW_SAGA: Symbol('GET_DEVICE_TYPE_FLOW_SAGA'),//设备类型示意图
  GET_PVMODULE_LIST_SAGA: Symbol('GET_PVMODULE_LIST_SAGA'),//光伏组件列表
  GET_INVERTER_LIST_SAGA: Symbol('GET_INVERTER_LIST_SAGA'),//组串式逆变器列表
  GET_BOXTRANSFORMER_LIST_SAGA: Symbol('GET_BOXTRANSFORMER_LIST_SAGA'),//箱变列表
  GET_CONFLUENCEBOX_LIST_SAGA: Symbol('GET_CONFLUENCEBOX_LIST_SAGA'), // 获取汇流箱列表

  getCollectorLine: Symbol('getCollectorLine'), // 获取集电线路信息列表
  getBoosterstation: Symbol('getBoosterstation'), // 获取升压站信息列表
  getPowerNet: Symbol('getPowerNet'), // 获取电网信息列表

  GET_STATION_DEVICELIST_SAGA: Symbol('GET_STATION_DEVICELIST_SAGA'),//获取单电站设备列表
  EDIT_MONTH_YEAR_DATA_SAGA:Symbol('EDIT_MONTH_YEAR_DATA_SAGA'),//编辑月/年累计发电量
  getFanList:Symbol('getFanList'),//风机实时数据列表
  getNewFanList:Symbol('getNewFanList'),//新的风机实时数据列表

  resetStore:Symbol('resetStore'),//重置store状态
  changeSingleStationStore: Symbol('changeSingleStationStore2'),//改变单电站store数据成功
  getSingleStationSuccess:Symbol('getSingleStationSuccess'),//请求成功 
  singleStationFetch: Symbol('singleStationFetch'),//loading
  getSingleScatter: Symbol('getSingleScatter'),// 等效散点图数据
  pointparams: Symbol('pointparams'),
  getSingleRealChartsData: Symbol('getSingleRealChartsData'),
  stopSingleRealData: Symbol('stopSingleRealData'),

  getPvSingleStation: Symbol('getPvSingleStation'),
  getWindSingleStation: Symbol('getWindSingleStation'),
  monthplanpower: Symbol('monthplanpower'),
  getPvMonitorPower: Symbol('getPvMonitorPower'),
  getWeatherDetail: Symbol('getWeatherDetail'),
  getStationAlarm: Symbol('getStationAlarm'),
  getRadiationchart: Symbol('getRadiationchart'),
  getNewDeviceTypeFlow: Symbol('getNewDeviceTypeFlow'),
  getSketchmap: Symbol('getSketchmap'),
}