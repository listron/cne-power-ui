import immutable from 'immutable';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';


const initState = immutable.fromJS({
  stationCode: '', // 选中的电站
  dateType: [], // 时间类型
  
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