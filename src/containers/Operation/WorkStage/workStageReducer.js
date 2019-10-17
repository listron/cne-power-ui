import immutable from 'immutable';

const workStageAction = {
  getTaskList: Symbol('getTaskList'),
  getRunningLog: Symbol('getRunningLog'),

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  stageStations: [], // 工作台设置的电站信息子集
  stageParams: {}, // 工作记事列表请求参数
  showModal: false, // 弹框
  modalKey: '', // 各类型弹框对应的key: handleRecord增改记事, recordDetail记事详情, addPlan添加计划, handlePlan下发删除计划 

  stageLoading: false, // 列表loading
  stageList: [], // 记事列表
  stageNumInfo: {}, // 记事列表各类型统计信息 - 全部, 计划, 消缺, 巡检, 记事
  planList: [], // 日历列表
  runLogLoading: false, // 运行记录loading
  runLogInfo: [], // 运行记录信息
  ticketsLoading: false, // 两票三制loading
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
