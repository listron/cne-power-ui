import Immutable from 'immutable';
import { historyWarnAction } from './historyWarnAction.js';

const initState = Immutable.fromJS({
  loading: false,
  createTimeStart: '',	 // 开始时间
  createTimeEnd: '',	 // 结束时间
  algorithmModalName: [], // 算法模型名称
  algorithmModalId: [], // 算法模型id
  stationCode: 0,
  deviceTypeCode: 0,
  selectDeviceCode: [],
  faultWarnHistoryData: {}, // 获取历史预警列表
  pageSize: 10,
  pageNum: 1,
  sortField: '',
  sortMethod: '',
});


const historyWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case historyWarnAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload));
    case historyWarnAction.fetchHistoryWarnSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case historyWarnAction.resetStore:
      return initState;
  }
  return state;
};

export default historyWarnReducer;
