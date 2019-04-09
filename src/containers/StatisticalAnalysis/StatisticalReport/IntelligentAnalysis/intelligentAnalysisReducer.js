import immutable from 'immutable';
import moment from 'moment';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

let time = moment().subtract(0, 'months').format('YYYY-MM');
const initState = immutable.fromJS({
  stationCode: null, // 选中的电站code
  stationName:'', // 选中的电站名称
  dateType: 'month', // 时间类型
  year: '',
  month: '',
  time: time,
  monthTime: '',
  yearTime: '',
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