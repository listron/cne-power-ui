import immutable from 'immutable';

const workStageAction = {
  getTaskList: Symbol('getTaskList'),
  // getSettableNodes: Symbol('getSettableNodes'),
  // getSettedInfo: Symbol('getSettedInfo'),
  // getSettableUsers: Symbol('getSettableUsers'),
  // createSettedInfo: Symbol('createSettedInfo'),
  // editSettedInfo: Symbol('editSettedInfo'),
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  stageStations: [], // 工作台设置的电站信息子集
  stageParams: {}, // 工作记事列表请求参数

  stageList: [], // 记事列表
  planList: [], // 日历列表
  runRecordInfo: [], // 运行记录信息
  ticketsInfo: [], // 两票三制信息
});

const workStage = (state = initState, action) => {
  switch (action.type) {
    case workStageAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case workStageAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case workStageAction.resetStore:
      return initState;
  }
  return state;
};

export { workStage, workStageAction };
