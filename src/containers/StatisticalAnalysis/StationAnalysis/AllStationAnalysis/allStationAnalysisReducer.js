import Immutable from 'immutable';

import { allStationAnalysisAction } from './allStationAnalysisAction.js';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  stationType: '1',//默认展示风电站tab。
  stationCode: null, // 选中的电站
  showPage: 'multiple',//默认展示多电站分析
  year: [],
  month: '',
  allStationYear:[],

  // 全部电站  table 
  pageNum: 1, // 当前页
  pageSize: 10, // 每页条数singleStationCode
  totalNum: 0,//总数
  targetShowType: 'EqpGen',//小tab选中项，默认是发电量
  sortType: 'asc',//排序方式（asc-升序，desc-降序）
  sort: 'planGenRate',//按什么排序

  selectYear: '', // 计划完成年
  powerSelectMonth: '',// 月综合指标统计表
  powerSelectYear: '',// 年综合指标统计表

  // 全部电站  数据列表
  allStationAvalibaData: [],//有数据的年/月
  allStationStatisticData: {},//计划完成情况
  allStationStatisticTableData: [],//发电量table
  allStationMonthPieData: [],//pie图
  allStationMonthComplete: '',//计划完成率
  allStationMonthBarData: [],//发电量的bar图

  // 单电站
  singleStationCode: null,
  singleYear:null,// 年
  singleleMonth:null, // 多年
  singleRangYear:[null,null], // 多年
  singleStationStatisticData: {},//单电站计划完成情况
  singleStationPowerData: [],//发电量分析数据
  singleStationLostPowerData: [],//损失电量分析数据
  singleStationMonthPieData: [],//发电量饼图
  singleStationPlanRateData: [],//计划完成率分析
  singleStationPvCompareData: [],//光资源同比
  singleStationPowerEffectiveData: [],//发电效率
  singleStationDayCompleteRateData: [],//单电站累计完成率

});
const allStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAnalysisAction.ALLSTATIONDATA_FETCH:
      return state.set('loading', true)
    case allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case allStationAnalysisAction.resetStore:
      return initState;

  }
  return state;
}
export default allStationAnalysisReducer;
