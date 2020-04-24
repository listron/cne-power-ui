import immutable from 'immutable';
import moment from 'moment';
import {eamListAction} from './eamListAction';

const initState = immutable.fromJS({
  tableLoading: false,
  selectedStation: [],
  eamStationList: [],
  eamTableData: {
    dataList: [],
    pageCount: '0',
  },
  workOrderType: '',
  startTime: moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
  endTime: moment().format('YYYY-MM-DD 23:59:59'),
  pageSize: 10,
  pageNum: 1,
  otherTimeFlag: false,
});

const eamListReducer = (state = initState, action) => {
  switch (action.type) {
    case eamListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.resetStore:
      return initState;
  }
  return state;
};

export default eamListReducer;
