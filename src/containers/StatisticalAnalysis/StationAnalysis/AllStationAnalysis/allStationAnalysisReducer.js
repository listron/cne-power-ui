import Immutable from 'immutable';

import { allStationAnalysisAction } from './allStationAnalysisAction.js';

var initState = Immutable.fromJS({
  loading: false,
  dateType:'month',
  stationCode: null, // 选中的电站
  showPage: 'multiple',//默认展示多电站分析
  year:'',
  month:'',
  pageNum: 1, // 当前页
  pageSize: 10, // 每页条数
  totalNum:  0,//总数
  sortType:'desc',//排序方式（asc-升序，desc-降序）
  sort:'计划完成率',//按什么排序（电站名称、区域、计划发电量、实际发电量、计划完成率、发电量环比、辐射总量、资源环比、等效利用小时数、pr、损失电量、损失电量等效时）
  AllStationAvalibaData:[],//有数据的年/月
  AllStationStatisticData:{},//计划完成情况
  AllStationStatisticTableData:[],//发电量table
  AllStationMonthPieData:[],//pie图
  AllStationMonthComplete:'',//计划完成率
  AllStationMonthBarData:[],//发电量的bar图

});
const allStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAnalysisAction.ALLSTATIONDATA_FETCH:
      return state.set('loading',true)
    case allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
   
  }
  return state;
}
export default allStationAnalysisReducer;
