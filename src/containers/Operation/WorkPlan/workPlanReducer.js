import immutable from 'immutable';

const workPlanAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  planParams: {},
  planListPageParams: {},

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
