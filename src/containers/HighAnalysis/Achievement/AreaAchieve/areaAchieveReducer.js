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
});

export const achieveArea = (state = initState, action) => {
  switch (action.type) {
    case areaAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case areaAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case areaAchieveAction.resetStore:
      return initState;
  }
  return state;
};
