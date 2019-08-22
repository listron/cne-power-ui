import immutable from 'immutable';
import { dailyQueryAction } from './dailyQueryAction';

 const initState = immutable.fromJS({
  tableLoading: false,
  stationType: 0, // 选中的电站类型
  objectType: 0, // 日报故障类型
  tableType: 'quotaList', // 列表类别
  queryParam: { // 请求数据的集合
    stationCodes: [], // 选中的电站
    startDate: null, // 开始时间
    endDate: null, // 结束时间
  },
  listParam: {
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
  },

  keyWord: '', // 关键字
  quotaInfoData: [], // 选中的关键指标信息数组
  quotaData: [], // 获取关键指标树
  quotaListData: {}, // 关键指标列表信息

  powerInformation: '', // 限电原因 
  faultIds: [], // 故障信息的Ids
  faultData: [], // 获取故障类型
  faultListData: {}, //获取故障信息列表

  limitListData: {}, // 限电信息列表
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
