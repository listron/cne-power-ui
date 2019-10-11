import immutable from 'immutable';
import moment from 'moment';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

const initState = immutable.fromJS({
  tabsType: 'singleStation',
  dateType: 1, // 时间类型
  reportShow: false, // 显示报告
  stationCode: null, // 选中的电站code
  stationName: '', // 选中的电站名称
  areaName: null, // 选中的区域
  startTime: null,
  month: moment().subtract(1, 'months').format('MM'), // 选中的月份 
  year: moment().subtract(1, 'years').format('YYYY'), // 选中的年份
  singleStationInfo: {}, // 单电站分析数据
  areaStationInfo: {}, // 同区域电站对比分析数据
  areaInfo: {}, // 区域对比分析数据
})

  const dataintelligentAnalysis = (state = initState, action) => {
    switch (action.type) {
      case intelligentAnalysisAction.GET_INTELLIGENTANALYSIS_SUCCESS :
        return state.merge(immutable.fromJS(action.payload));
      case intelligentAnalysisAction.changeIntelligentAnalysisStore:
        return state.merge(immutable.fromJS(action.payload));
      case intelligentAnalysisAction.resetStore:
        return initState;
    }
    return state;
  }
  
  export default dataintelligentAnalysis;