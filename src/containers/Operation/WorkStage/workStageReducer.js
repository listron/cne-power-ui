import immutable from 'immutable';

const workStageAction = {
  getTaskList: Symbol('getTaskList'),
  addNewRecord: Symbol('addNewRecord'),
  setRecordComplete: Symbol('setRecordComplete'),
  editRecord: Symbol('editRecord'),
  getRunningLog: Symbol('getRunningLog'),
  getTickets: Symbol('getTickets'),

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  stageStations: [], // 工作台设置的电站信息子集
  showModal: false, // 弹框
  modalKey: null, // 各弹框key: addRecord增记事 editRecord改记事, recordDetail记事详情, planDetail,addPlan添加计划, handlePlan下发删除计划 

  recordDetailInfo: null, // 记事详情 {} => 增 / 编辑 / 查看
  saveRecordLoading: false, // 添加 + 编辑记事详情loading状态
  deleteRecordLoading: false, // 删除详情loading状态

  stageLoading: false, // 记事列表loading
  stageList: [], // 记事列表信息
  stageNumInfo: {}, // 记事列表各类型统计信息 - 全部, 计划, 消缺, 巡检, 记事

  planList: [], // 日历列表
  addPlanLoading: false, // 添加计划

  runLogLoading: false, // 运行记录loading
  runLogInfo: {}, // 运行记录信息
  ticketsLoading: false, // 两票三制loading
  ticketsInfo: {}, // 两票三制信息
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
