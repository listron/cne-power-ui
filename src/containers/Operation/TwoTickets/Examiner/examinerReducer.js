import Immutable from 'immutable';

const examinerAction = {
  getSettingList: Symbol('getSettingList'),
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
}

const initState = Immutable.fromJS({
  templateType: 1, // tab页控制 1-工作票, 2-操作票
  tableParam: {
    selectedStation: [],
    sortField: '', //station_name state, create_time
    sortMethod: '', // 排序规则 "asc"：正序  "desc"：倒序
    pageNum: 1,
    pageSize: 10,
  },
  settingList: [], // 工作票设置列表
  total: 0, // 设置列表总条数合计
  settedDetail: null, // 电站审核人配置详情
  userGather: {},
});

const examiner = (state = initState, action) => {
  switch (action.type) {
    case examinerAction.fetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case examinerAction.changeStore:
      return state.merge(Immutable.fromJS(action.payload));
    case examinerAction.resetStore:
      return initState;
  }
  return state;
};

export { examiner, examinerAction };
