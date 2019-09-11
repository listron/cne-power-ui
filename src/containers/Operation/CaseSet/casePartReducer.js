import immutable from 'immutable';
import { casePartAction } from './casePartAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  questionTypeCodes: [],
  deviceModeList: [],
  faultDescription: '',
  stationCodes: [],
  userName: '',
  userId: null,
  total: 0,
  pageNum: 1,
  pageSize: 10,
  showPage: 'list',
  deviceModeData: [],
  casePartTableData: [],
  questionTypeList: [],
  caseDetail: {},
  userData: [],
  selectedRowKeys: [],
  selectedRowData: [],
});

const casePartReducer = (state = initState, action) => {
  switch (action.type) {
    case casePartAction.changeCasePartStore:
      return state.merge(immutable.fromJS(action.payload));
    case casePartAction.resetStore:
      return initState;
  }
  return state;
};

export default casePartReducer;
