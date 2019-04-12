import immutable from 'immutable';
import moment from 'moment';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

const initState = immutable.fromJS({
  reportLoading: false, // 报告请求的loading
  stationCode: null, // 选中的电站code
  stationName:'', // 选中的电站名称
  regionName: null, // 选中的区域
  dateType: 1, // 时间类型
  startTime: null, 
  test:null,
  reportShow: false, // 显示报告
  month: moment().subtract(1,'months').format('YYYY-MM-DD'), // 选中的月份 
  year:  moment().subtract(1,'year').format('YYYY-MM-DD'), // 选中的年份
  generatinCapacity: {}, // 累计发电量信息及原因
  systematicStatistics: {}, // 年系统效率(PR)信息及原因(仅年查询此项)年系统效率(PR)信息及原因(仅年查询此项)
  completionRate: {}, // 发电完成率信息及原因
  lossOfElectricity: {}, // 损失电量信息及原因
  areaPartABean: {}, // 区域电站等效时信息及原因
  areaPartBBean: {}, // 区域电站计划完成率信息及原因
  areaPartCBean: {}, // 区域电站损失电量信息及原因
  areaPartDBean: {}, // 区域电站得分信息及原因
})

  const dataintelligentAnalysis = (state = initState, action) => {
    switch (action.type) {
      case intelligentAnalysisAction.changeIntelligentAnalysisStore:
        return state.merge(immutable.fromJS(action.payload));
      case intelligentAnalysisAction.resetStore:
        return initState;
    }
    return state;
  }
  
  export default dataintelligentAnalysis;