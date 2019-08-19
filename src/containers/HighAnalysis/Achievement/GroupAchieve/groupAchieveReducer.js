import immutable from 'immutable';

export const groupAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getGroupModesInfo: Symbol('getGroupModesInfo'),
  getGroupCapacity: Symbol('getGroupCapacity'),
  getGroupRank: Symbol('getGroupRank'),
  getGroupTrendInfo: Symbol('getGroupTrendInfo'),
  getGroupLostGenHour: Symbol('getGroupLostGenHour'),
};

const initState = immutable.fromJS({
  modesInfo: [], // 顶部选中的机型
  capacityInfo: [],
  capacityTime: 0,
  capacityLoading: false,
  groupCapacityInfo: [],
  groupCapacityLoading: false,
  groupCapacityTime: 0,
  groupRankInfo: [],
  groupRankTime: 0,
  groupRankLoading: false,
  groupTrendInfo: [],
  groupTrendTime: 0,
  groupTrendLoading: false,
  groupTimeStatus: '2',
  groupLostGenHourInfo: {},
  groupLostTime: 0,
  groupLoseLoading: false,
  areaSelected: {}, // chart选中的区域
  dateSelected: null, // pba趋势

  pbaStatistics: [], // 各区域PBA排名信息
  pbaDatesInfo: [], // 区域pba的时间趋势
  powerLostInfo: [], // 损失电量分解图
  dataIndex: '', // 保存点击的下标
  selectStationCode: [], // 保存单选区域的信息
  selectTime: '', // 保存选择时间

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
