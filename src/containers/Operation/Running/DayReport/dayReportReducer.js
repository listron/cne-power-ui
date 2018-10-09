import Immutable from 'immutable';

import { dayReportAction } from './dayReportAction';

const initState = Immutable.fromJS({
  loading: false,
  showPage: 'list',//默认展示列表页list,上报日报页report, 详情页detail, 编辑页edit
  pageSize: 20,
  pageNum: 1,
  reportTime: '', // 选中的上报日报的日期;
  reportRegion: '', // 选中的上报区域;

  reportStation: [], // 选中的上报日报的电站;
  dayReportTotalInfoArr: [], // 日报上报所有电站全部详情信息

  disableReportStation: [],//api- 选中日期已上报过日报的电站code组
  dayReportList: [], // api- 日报主页各电站报表情况;
  dayReportConfig: {}, // api -  日报相关配置信息
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