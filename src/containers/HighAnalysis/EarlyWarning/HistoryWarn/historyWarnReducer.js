import Immutable from 'immutable';
import { historyWarnAction } from './historyWarnAction';

var initState = Immutable.fromJS({
  loading: false,
  inefficiencyStatus: 4,// 历史预警
  stationCodes: [], // 选中的电站
  belongMatrixs: [],//所属方阵
  createTimeStart: '', // 查询时段起点
  createTimeEnd: '',//查询时段结点
  pageNum: 1,
  pageSize: 10,
  sortField: 'happen_time', // 排序字段
  sortMethod:'desc', //排序方式 desc/asc

  totalNum: null,
  historyWarnList: [], //  历史预警列表
  matrixList: [], // 电站方阵列表
});


const HistoryWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case historyWarnAction.historyWarnFetch:
      return state.set('loading',true)
    case historyWarnAction.getHistoryWarnFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case historyWarnAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload))
    case historyWarnAction.RESET_STORE:
      return initState
  }
  return state;
}

export default HistoryWarnReducer;