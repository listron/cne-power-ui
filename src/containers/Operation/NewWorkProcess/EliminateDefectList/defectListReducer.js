import immutable from 'immutable';

const eliminateDefectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDefectList: Symbol('getDefectList'),
  getParticipant: Symbol('getParticipant'),
  getDefectAction: Symbol('getDefectAction'),
};

const initState = immutable.fromJS({
  listLoading: false,
  listParams: {
    stationCodes: [],
    operName: '', // 执行人
    isMy: 0, // 1代表查询我参与过的
    stateId: null, // 状态id
    sortField: 'stationName', // stationName eventNum createTime keepLength sort
    sortMethod: 'descend', // 'ascend' 'descend'
    pageSize: 10,
    pageNum: 1,
  },
  total: 0, // 总数
  defectListData: [], // 渲染为table的缺陷列表
  participantList: [], // 搜索区参与人列表
  stateAndTotalList: [], // 状态统计数据
  allowedActions: [], //可执行的动作
});

const eliminateDefectList = (state = initState, action) => {
  switch (action.type) {
    case eliminateDefectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eliminateDefectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eliminateDefectListAction.resetStore:
      return initState;
  }
  return state;
};

export { eliminateDefectList, eliminateDefectListAction };
