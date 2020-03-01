import immutable from 'immutable';
import moment from 'moment';

const newInspectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getInspectList: Symbol('getInspectList'),
  setInspectCheck: Symbol('setInspectCheck'),
};

const initState = immutable.fromJS({
  tableLoading: false,
  params: {
    stationType: '',
    stationCodes: '',
    timeInterval: '0',
    status: '5',
    pageNum: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',
    deviceTypeCode: '',
    sort: '2,1',
  },
  selectedRowKeys: [],
  total: 0,
  inspectList: [],
  inspectStatusStatistics: {},

});

const newInspectList = (state = initState, action) => {
  switch (action.type) {
    case newInspectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case newInspectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case newInspectListAction.resetStore:
      return initState;
  }
  return state;
};

export { newInspectList, newInspectListAction };
