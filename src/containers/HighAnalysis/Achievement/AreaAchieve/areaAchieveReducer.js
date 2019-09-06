import immutable from 'immutable';

export const areaAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getStationCapacity: Symbol('getStationCapacity'),
  getLostGenHour: Symbol('getLostGenHour'),
  getTrendInfo: Symbol('getTrendInfo'),
  getIndicatorRank: Symbol('getIndicatorRank'),
  getIndicatorRankTotal: Symbol('getIndicatorRankTotal'),
  getModesInfo: Symbol('getModesInfo'),
  getDeviceType: Symbol('getDeviceType'),
};

const initState = immutable.fromJS({
  capacityInfo: [],
  lostGenHourInfo: {},
  trendInfo: [],
  indicatorRankInfo: [],
  rankTotal: [{
    regionName: '',
    indicatorData: {
      value: 0,
      actualGen: 0,
      theoryGen: 0,
    },
  }],
  modesInfo: [], // 厂家 + 型号
  capacityTime: 0,
  rankTime: 0,
  trendTime: 0,
  lostTime: 0,
  rankLoading: false,
  capacityLoading: false,
  trendLoading: false,
  loseLoading: false,
  timeStatus: '2', // 日月年
  dataIndex: '', // 选中信息
  selectStationCode: [], // 选中电站信息
  selectTime: '', // 选中时间
  dataName: '', // 保存选择区域名称
  deviceData: [], // 设备型号
});

export const achieveArea = (state = initState, action) => {
  switch (action.type) {
    case areaAchieveAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case areaAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case areaAchieveAction.resetStore:
      return initState;
  }
  return state;
};
