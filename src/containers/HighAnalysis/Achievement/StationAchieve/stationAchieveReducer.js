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
};

const initState = immutable.fromJS({
  active: 'stop', // lost, stop, curve

  lostStringify: '', // station - 缓存search信息字符串
  lostQuota: null, // 指标
  lostSort: 'name', // 排序方式 name or quota
  lostChartDevice: null, // chart选中的设备 {deviceFullcode, deviceName}
  lostChartTime: null, // chart选中的时间
  lostChartTimeMode: 'month', // chart选中时间格式 - month year day

  stopTopStringify: '', // stop - 缓存字符串
  stopElecType: 'all', // 0:all全部，1:faultGen风机故障，2:planShutdownGen计划停机，3:substationGen变电故障，4:courtGen场外因素，5:otherGen其他损失
  stopType: '', // 全部,....
  stopChartDevice: null, // 图表设备选中
  stopChartTime: null, // 图表时间选中
  stopChartTimeMode: 'month', // 图表时间格式选中
  stopChartTypes: null, // 图表各类停机次数与市场选中

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
