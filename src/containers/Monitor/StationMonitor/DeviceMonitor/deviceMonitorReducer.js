import Immutable from 'immutable';

const deviceAction = {
  GET_DEVICE_FETCH_SUCCESS: Symbol('GET_DEVICE_FETCH_SUCCESS'),
  CHANGE_DEVICE_MONITOR_STORE: Symbol('CHANGE_DEVICE_MONITOR_STORE'),
  RESET_DEVICE_MONITOR_STORE: Symbol('RESET_DEVICE_MONITOR_STORE'),

  // yield takeLatest(deviceAction.getDevices, getDevices);
  // yield takeLatest(deviceAction.deviceInfoMonitor, deviceInfoMonitor);
  // yield takeLatest(deviceAction.deviceChartMonitor, deviceChartMonitor);
  // yield takeLatest(deviceAction.stopMonitor, stopMonitor);
  getDevices: Symbol('getDevices'), // 获取同类设备列表
  getDeviceInfoMonitor: Symbol('deviceInfoMonitor'), // 10s信息
  getDeviceChartMonitor: Symbol('deviceChartMonitor'), // 1h图表信息
  stopMonitor: Symbol('stopMonitor'), // 获取同类设备列表

  getwindturbineData: Symbol('getwindturbineData'), // 单风机详情
  getSequencechartData: Symbol('getSequencechartData'),
  getWindDeviceCharts: Symbol('getWindDeviceCharts'),
  stopWindDeviceCharts: Symbol('stopWindDeviceCharts'),
  getWindDeviceRealData: Symbol('getWindDeviceRealData'),
}

const initState = Immutable.fromJS({
  deviceDetail: {}, // 单设备详情
  devicePointData: [], // 测点数据
  deviceAlarmList: [], // 单设备告警
  devices: [], // 设备列表列表
  deviceTenMin: [], // 设备时序图
  tenMinUnix: null, // 时序时间记录
  tenMinChartLoading: false, // chartloading状态
  subDeviceList: [], // 下级设备信息
  deviceEvents: [], // 单设备事件信息
  branchTenMin: [], // 仅组串逆变器下支路电流数组
  branchTenMinUnix: null, // 仅组串逆变器下支路电流时间记录

  sequencechart: {}, // 风机图表
  scatterpoint: {}, // 风机散点图
  scatterpointTime: null, // 风机散点图时间
  sequencediagram: {}, // 风机时序图
  sequencediagramTime: null, // 风机时序图时间
});

const deviceMonitor = (state = initState, action) => {
  switch (action.type) {
    case deviceAction.GET_DEVICE_FETCH_SUCCESS: // api请求成功
      return state.merge(Immutable.fromJS(action.payload));
    case deviceAction.CHANGE_DEVICE_MONITOR_STORE: // 手动替换数据
      return state.merge(Immutable.fromJS(action.payload));
    case deviceAction.RESET_DEVICE_MONITOR_STORE: // 重置
      return initState;
  }
  return state;
}

export { deviceMonitor, deviceAction };
