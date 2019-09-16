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
  orderFiled: '',
  orderType: '',
  showPage: 'list',
  deviceModeData: [], //筛选条件的机型数据
  casePartTableData: [],
  questionTypeList: [],
  caseDetail: {},
  userData: [],
  selectedRowKeys: [],
  selectedRowData: [],
  modesInfo: [], //新增和编辑里的机型

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
