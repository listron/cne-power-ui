import immutable from 'immutable';

export const stationAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),

  testStation: Symbol('testStation'),
};

const initState = immutable.fromJS({
  testStationInfo: [],
  active: 'lost', // lost, stop, curve
  // topStringify: '', // 保存的请求路径信息
  // areaSelected: {}, // chart选中的区域
  // dateSelected: null, // pba趋势

  // modesInfo: [], // 厂家 + 型号
  // pbaStatistics: [], // 各区域PBA排名信息
  // pbaDatesInfo: [], // 区域pba的时间趋势
  // powerLostInfo: [], // 损失电量分解图
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
