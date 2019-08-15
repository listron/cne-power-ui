import immutable from 'immutable';

export const stationAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDevices: Symbol('devices'),
  getLostRank: Symbol('getLostRank'),
  getLostTrend: Symbol('getLostTrend'),
  getLostTypes: Symbol('getLostTypes'),
  getStopElec: Symbol('getStopElec'),
  getStopRank: Symbol('getStopRank'),
  getStopTrend: Symbol('getStopTrend'),
  getStopTypes: Symbol('getStopTypes'),

  getCurveDevices: Symbol('getCurveDevices'),
  getCurveDevicesAep: Symbol('getCurveDevicesAep'),
  getCurveDevicesPsd: Symbol('getCurveDevicesPsd'),
  getCurveMonths: Symbol('getCurveMonths'),
  getCurveMonthAep: Symbol('getCurveMonthAep'),
  getCurveMonthPsd: Symbol('getCurveMonthPsd'),
};

const initState = immutable.fromJS({
  pageName: 'lost', // lost, stop, curve

  lostStringify: '', // station - 缓存search信息字符串
  lostQuota: null, // 指标
  lostChartDevice: null, // chart选中的设备{deviceFullcode, deviceName}
  lostChartTime: null, // chart选中的时间
  lostChartTimeMode: 'month', // chart选中时间格式 - month year day

  stopTopStringify: '', // stop - 缓存字符串
  stopElecType: 'all', // all全部-faultGen风机故障-planShutdownGen计划停机-substationGen变电-courtGen场外-otherGen其他
  stopType: '', // 全部,....
  stopChartDevice: null, // 图表设备选中 {}
  stopChartTime: null, // 图表时间选中 string
  stopChartTimeMode: 'month', // 图表时间格式选中
  stopChartTypes: null, // 图表各类停机次数与时长选中 {}

  curveTopStringify: '', // curve 缓存请求字符串
  curveDeviceFullcode: null, // 选中的设备code
  curveDeviceName: null, // 选中的设备name
  curveDevicesTime: null, // 邻比分析设备选中时间
  curveCheckedMonths: [], // 环比分析各月选中时间
  curveAllMonths: [], // 环比分析所有月

  modeDevices: [], // 电站 设备型号+设备集合

  lostRank: [], // 损失根源 - 指标排名
  lostRankLoading: false,
  lostTrend: [], // 损失根源 - 指标趋势
  lostTrendLoading: false,
  lostTypes: {}, // 损失根源 - 损失电量分解
  lostTypesLoading: false,

  stopElec: {}, // 停机 - 损失电量
  stopRank: [], // 停机 - 设备停机时长及次数
  stopRankLoading: false,
  stopTrend: [], // 停机  - 日月年 停机时长次数趋势图
  stopTrendLoading: false,
  stopTypes: [], // 停机 - 各类停机时长及次数
  stopTypesLoading: false,

  curveDevices: {}, // 各机组曲线
  curveDevicesLoading: false,
  curveDevicesAep: [], // 机组aep及风速
  curveDevicesAepLoading: false,
  curveDevicesPsd: [], // 机组聚合度psd
  curveDevicesPsdLoading: false,
  curveMonths: {}, // 某机组各月功率曲线
  curveMonthsLoading: false,
  curveMonthAep: [], // 某机组各月aep及风速
  curveMonthAepLoading: false,
  curveMonthPsd: [], // 某机组psd聚合度
  curveMonthPsdLoading: false,
});

export const achieveStation = (state = initState, action) => {
  switch (action.type) {
    case stationAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case stationAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case stationAchieveAction.resetStore:
      return initState;
  }
  return state;
};
