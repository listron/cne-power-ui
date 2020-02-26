import immutable from 'immutable';
const meterListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  // 获取抄表列表
  getMeterList: Symbol('getMeterList'),
  // 获取执行人列表
  getParticipant: Symbol('getParticipant'),
};

const initState = immutable.fromJS({
  selectedStation: [],
  tableLoading: false,
  listParams: {
    stationCodes: [], // 电站code
    startSettleMonth: null, // 开始月份
    endSettleMonth: null, // 结束月份
    operName: null, // 执行人
    stateId: null, // 状态id
    isMy: null, // 1代表查询我参与过的
    sortField: 'create_time', // 排序字段
    sortMethod: 'desc', // 排序规则
    pageNum: 1, // 页码
    pageSize: 10, // 条数
    processType: 3, // 流程类型-抄表
  },
  meterData: {// 抄表列表数据
    tableData: {
      pageCount: 0,
      dataList: [],
    },
    stateAndTotalList: [],
  },
  sortField: 'createTime',
  sortMethod: 'descend',
  searchStatus: '', // 查询状态
  participantList: [], // 执行人列表
  operatorValue: [], // 执行人名称
});

const meterList = (state = initState, action) => {
  switch (action.type) {
    case meterListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case meterListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case meterListAction.resetStore:
      return initState;
  }
  return state;
};

export { meterList, meterListAction };
