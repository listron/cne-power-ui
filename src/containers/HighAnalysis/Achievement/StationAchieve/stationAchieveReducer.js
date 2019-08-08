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
  testStationInfo: [],
  active: 'lost', // lost, stop, curve
  lostStringify: '', // station - search信息字符串
  lostQuota: null, // 指标
  lostSort: 'name', // 排序方式 name or quota
  stopTopStringify: '',

  chartDevice: null, // chart选中的设备
  chartTime: null, // chart选中的时间
  chartTimeMode: 'month', // chart选中时间格式 - month year day

  modeDevices: [], // 电站 设备型号+设备集合
  lostRank: [], // 损失根源 - 指标排名
  lostRankLoading: false,
  lostTrend: [], // 损失根源 - 指标趋势
  lostTrendLoading: false,
  lostTypes: [], // 损失根源 - 损失电量分解
  lostTypesLoading: false,
  stopElec: [], // 停机 - 损失电量
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
