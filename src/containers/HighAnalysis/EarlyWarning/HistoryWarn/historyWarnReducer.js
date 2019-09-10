import Immutable from 'immutable';
import { historyWarnAction } from './historyWarnAction';

var initState = Immutable.fromJS({
  loading: false,
  inefficiencyStatus: 4, // 历史预警 后台默认的
  stationCodes: [], // 选中的电站
  belongMatrixs: [], //所属方阵
  startTime: '', // 查询时段起点
  endTime: '', //查询时段结点
  pageNum: 1,
  pageSize: 10,
  sortField: 'happen_time', // 排序字段
  sortMethod: 'desc', //排序方式 desc/asc

  totalNum: null,
  historyWarnList: [], //  历史预警列表
  matrixList: [], // 电站方阵列表
  sequenceChartList: [], // 预警时序图
  nowSequenceChartList: [], //现在的时序图数据
});


const HistoryWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case historyWarnAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload));
    case historyWarnAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default HistoryWarnReducer;
