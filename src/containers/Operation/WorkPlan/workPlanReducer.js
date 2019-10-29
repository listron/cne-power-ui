import immutable from 'immutable';

const workPlanAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),

  getWorkPlanList: Symbol('getWorkPlanList'),
  getWorkPlanDetail: Symbol('getWorkPlanDetail'),
  addWorkPlan: Symbol('addWorkPlan'),
  editWorkPlan: Symbol('editWorkPlan'),
  deleteWorkPlan: Symbol('deleteWorkPlan'),
  getInspectUsers: Symbol('getInspectUsers'),
};

const initState = immutable.fromJS({
  planParams: {
    planTypeCode: [],
    stationCodes: [],
    cycleTypeCode: [],
    planStatus: undefined,
    isMined: false,
    isOverTime: false,
    planContent: '',
    createUser: '',
  },
  planListPageParams: {
    pageNum: 1,
    pageSize: 10,
    orderField: 1,
    orderMethod: 'asc',
  },
  planPageKey: 'list', // list列表页, edit编辑, add新增, detail详情

  planListLoading: false, // 计划列表loading
  addPlanLoading: false, // 新增计划loading
  deletePlansLoading: false, // 批量删除计划loading

  inspectUserList: [], // 制定人列表
  planList: [], // 计划列表
  planCount: 0, // 计划总数
  planDetail: {}, // 某条计划详情
  stationDeviceTypes: [], // 添加计划时, 电站对应的设备类型
});

const workPlan = (state = initState, action) => {
  switch (action.type) {
    case workPlanAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case workPlanAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case workPlanAction.resetStore:
      return initState;
  }
  return state;
};

export { workPlan, workPlanAction };
