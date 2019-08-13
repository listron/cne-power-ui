import immutable from 'immutable';
import moment from 'moment';
import { dailyQueryAction } from './dailyQueryAction';

 const initState = immutable.fromJS({
  tableLoading: false,
  stationType: 0, // 选中的电站类型
  tableType: 'quotaList', // 列表类别
  queryParam: { // 请求数据的集合
    stationCodes: [], // 选中的电站
    startDate: null, // 开始时间
    endDate: null, // 结束时间
  },
  indexCodes: [], // 关键指标的codes
  listParam: {
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
  },
  quotaData: [], // 获取关键指标树
  quotaListData: {}, // 关键指标列表信息
 });

 const dailyQueryReducer = (state = initState, action) => {
  switch (action.type) {
    case dailyQueryAction.GET_DAILYQUERY_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case dailyQueryAction.changeDailyQueryStore:
      return state.merge(immutable.fromJS(action.payload));
    case dailyQueryAction.resetStore:
      return initState;
  }
  return state;
};

export default dailyQueryReducer;
