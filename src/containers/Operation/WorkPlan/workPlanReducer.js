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
};

const initState = immutable.fromJS({
  planParams: {
    planTypeCode: [],
    stationCodes: [],
    cycleTypeCode: [],
    planStatus: [],
    isMined: true,
    isOverTime: false,
    planContent: '',
    createUser: '',
  },
  planListPageParams: {
    pageNum: 1,
    pageSize: 10,
    orderField: '',
    orderMethod: '',
  },
  planPageKey: 'list', // list列表页, edit编辑, add新增, detail详情

  planListLoading: false, // 计划列表loading
  addPlanLoading: false, // 新增计划loading
  deletePlansLoading: false, // 批量删除计划loading

  planList: [], // 计划列表
  planDetail: {}, // 某条计划详情
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
