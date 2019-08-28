import Immutable from 'immutable';
import { cleanoutRecordAction } from './cleanoutRecordAction';

var initState = Immutable.fromJS({
  loading: false,
  startTime: '2018',
  stationCodes: [],
  singleStationCode: null, //单电站
  showPage: 'multiple', //默认展示列表页list ,详情detail,
  stationType: '', // 电站类型("0"-风电、"1"-光伏、""全部)
  totalEffects: [], // 全站灰尘影响图表数据
  matrixEffects: [], //方阵灰尘影响图表数据
  stationName: '', // 电站名称(模糊匹配)
  pageNum: 1, // 当前页
  pageSize: 10, // 每页条数
  total: 0, // 各电站电站总数
  sortField: 'stationName', // 排序字段：stationName-电站名称，cleanPlanNum-清洗计划(个) cleanCycle–平均清洗周期(天) –cleanProfit累计清洗收益(万Kwh) cleanTime–最近清洗时间
  sortType: 0, // 排序方式 ;"0"升序; "1"降序
  mainListData: [], // 各电站清洗计划汇总列表数据
  cleanType: 0,
  detailPageNum: 1, //单电站当前页
  detailPageSize: 10, //单电站每页条数
  detailtotal: 0, //单电站详细电站总数
  cleanPlanNum: 0, //人工清洗计划数
  cleanProfit: '', //累计清洗收益
  cleanCycle: '', //平均清洗周期
  cleanTime: '', //平均清洗用时
  detailListData: [], //清洗计划记录列表  
  cleanPlandetail: {}, //获取人工清洗计划详情

  cleanRecordPageNum: 1, //清洗记录当前页
  cleanRecordPageSize: 10, //清洗记录每页条数
  cleanRecordTotal: null, //清洗记录总条数
  cleanRecordPlanTime: '', //清洗计划时间段
  cleanRecordCost: '', //清洗成本
  cleanRecordProfit: '', //累计清洗收益
  cleanRecordTime: null, //清洗用时
  cleanRecordListData: [], //清洗记录列表
  selectedStationIndex: 0, // 展示详情的电站index
  stationDetail: {}, // 电站详情
  allDepartmentData: [], // 所有部分列表信息
  stationBelongInfo: {}, // 电站的各种所属分类信息汇总。
  planId: '', //计划id
  cleanRecorddetail: {}, //获取清洗记录详情
  getMatrixData: [], //获取电站下的方阵

});

const CleanoutWarningReducer = (state = initState, action) => {
  switch (action.type) {
    case cleanoutRecordAction.CLEANOUT_RECORD_FETCH:
      return state.set('loading', true);
    case cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case cleanoutRecordAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default CleanoutWarningReducer;
