import Immutable from 'immutable';
import { dayReportAction } from './dayReportAction';
import moment from 'moment';

const initState = Immutable.fromJS({
  loading: false,
  showPage: 'list',//默认展示列表页list,上报日报页report, 详情页detail, 编辑页edit
  startTime: '', // 日报主页查询月,
  pageSize: 10,
  pageNum: 1,
  stationNameSort: 0, // 电站的默认排序方式;1 升序 0 降序，默认降序；
  stationType: 2, // 查询日报的电站类型;
  regionCode: null, // 选中的上报区域;
  
  reportDay: moment().subtract(1,'day').format('YYYY-MM-DD'), // 选中的上报日报的日期;
  reportStation: [], // 选中的上报日报的电站;
  showReportInputList: false, // 上报日报信息填写列表;

  disableReportStation: [],//api- 选中日期已上报过日报的电站code组
  dayReportList: [], // api- 日报主页各电站报表情况;
  totalNum: 0, // api - 所有日报总数。
  dayReportConfig: [], // api -  日报相关配置信息
  reportDisableStation: [], // api - 选中日期已上传过日报的电站编码数组
  stationReportBaseData: [], // api - 选中日期+电站后各待上传数据电站基础情况
  selectedDayReportDetail: {}, // api - 选中日报详情
});

const dayReportReducer = (state = initState, action) => {
  switch (action.type) {
    case dayReportAction.dayReportLoading: // loading态
      return state.set('loading',true);
    case dayReportAction.dayReportFetchSuccess : //请求成功并修改store数据
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case dayReportAction.changeDayReportStore: // 直接替换store值
      return state.merge(Immutable.fromJS(action.payload));
    case dayReportAction.resetDayReportStore: //重置参数
      return initState;
  }
  return state;
}


export default dayReportReducer;