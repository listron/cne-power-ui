import immutable from 'immutable';
import moment from 'moment';

const defectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDefectList: Symbol('getDefectList'),
  getParticipant: Symbol('getParticipant'),
};

const initState = immutable.fromJS({
  listLoading: false,
  listParams: {
    createTimeStart: '',
    createTimeEnd: '',
    stationType: '',
    stationCodes: [],
    deviceTypeCode: [], // 设备类型
    defectTypeCode: [], // 缺陷类型
    defectSource: [], //缺陷来源
    handleUser: ' ', // 处理人
    status: '', // 处理状态 0 待提交 1 待审核 2 执行中 3 待验收 4 已完成 
    handleUserList: [], // 选中的属于participantList的参与人列表
    sortField: 'create_time',
    sortMethod: 'desc',
    pageSize: 10,
    pageNum: 1,
  },
  total: 0, //总数
  selectedRowKeys: [], //选中的条数
  defectListData: [], //渲染为table的缺陷列表
  defectStatusStatistics: {}, // 状态条数
  defectTypes: [], //缺陷类型
  deviceTypes: [], //电站下的设备类型
  participantList: [], // 搜索区参与人列表
});

const defectList = (state = initState, action) => {
  switch (action.type) {
    case defectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case defectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case defectListAction.resetStore:
      return initState;
  }
  return state;
};

export { defectList, defectListAction };
