import Immutable from 'immutable';

const examinerAction = {
  getSettingList: Symbol('getSettingList'),
  getSettableNodes: Symbol('getSettableNodes'),
  getSettedInfo: Symbol('getSettedInfo'),
  getSettableUsers: Symbol('getSettableUsers'),
  createSettedInfo: Symbol('createSettedInfo'),
  editSettedInfo: Symbol('editSettedInfo'),
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = Immutable.fromJS({
  templateType: 1, // tab页控制 1-工作票, 2-操作票
  tableParams: {
    stationCodes: [],
    sortField: '', //station_name state, create_time
    sortMethod: '', // 排序规则 "asc"：正序  "desc"：倒序
    pageNum: 1,
    pageSize: 10,
  },
  listLoading: false, // 列表loading态
  settingList: [], // 工作票设置列表
  total: 0, // 设置列表总条数合计
  settableNodes: [], // 配置项节点数组
  handleDistributionId: null, // 正在处理的id 新增, 编辑, 查看
  editModalShow: false, // 编辑弹框
  detailModalShow: false, // 详情查看弹框
  modalStationName: '', // 编辑-详情弹框顶部电站
  settedDetail: null, // 电站审核人配置详情
  editLoading: 'normal', // 电站审核人配置按钮loading态,  normal, loading ,success
  userGather: {}, // 可选人员列表集合
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
