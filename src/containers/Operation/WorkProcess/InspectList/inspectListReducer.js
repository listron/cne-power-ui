import immutable from 'immutable';
import moment from 'moment';

const inspectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getInspectList: Symbol('getInspectList'),
  setInspectCheck: Symbol('setInspectCheck'),
};

const initState = immutable.fromJS({
  tableLoading: false,
  params: {
    stationType: '2',
    stationCodes: '',
    timeInterval: '0',
    status: '5',
    pageNum: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',
    deviceTypeCode: '',
    sort: '',
  },
  selectedRowKeys: [],
  total: 0,
  inspectList: [],
  inspectStatusStatistics: {},

});

const inspectList = (state = initState, action) => {
  switch (action.type) {
    case inspectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case inspectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case inspectListAction.resetStore:
      return initState;
  }
  return state;
};

export { inspectList, inspectListAction };
