import immutable from 'immutable';
import moment from 'moment';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

let time = moment().subtract(0, 'months').format('YYYY-MM');
const initState = immutable.fromJS({
  stationCode: '', // 选中的电站
  dateType: [], // 时间类型
  year: '',
  month: '',
  time: time
})

  const dataintelligentAnalysis = (state = initState, action) => {
    switch (action.type) {
      case intelligentAnalysisAction.GET_INTELLIGENT_ANALYSIS_FETCH_SUCCESS :
        return state.merge(immutable.fromJS(action.payload));
      case intelligentAnalysisAction.CHANGE_INTELLIGENT_ANALYSIS_STORE:
        return state.merge(immutable.fromJS(action.payload));
      case intelligentAnalysisAction.resetStore:
        return initState;
    }
    return state;
  }
  
  export default dataintelligentAnalysis;