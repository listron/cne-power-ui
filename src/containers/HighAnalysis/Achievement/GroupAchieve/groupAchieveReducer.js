import immutable from 'immutable';

export const groupAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getGroupModesInfo: Symbol('getGroupModesInfo'),
};

const initState = immutable.fromJS({
  modesInfo: [], // 顶部选中的机型
  // topDetes: [], // [starttime(Moment), endTime(Moment)]
  // topQuotas: [], // 选中的指标信息
  topStringify: '', // 保存的请求路径信息
  areaSelected: {}, // chart选中的区域
  dateSelected: null, // pba趋势

  pbaStatistics: [], // 各区域PBA排名信息
  pbaDatesInfo: [], // 区域pba的时间趋势
  powerLostInfo: [], // 损失电量分解图

});

export const achieveGroup = (state = initState, action) => {
  switch (action.type) {
    case groupAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case groupAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case groupAchieveAction.resetStore:
      return initState;
  }
  return state;
};
