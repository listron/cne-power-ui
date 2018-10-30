import Immutable from 'immutable';
import moment from 'moment';

import { operateAnalysisAction } from './operateAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  year: null,
  stationCode: null,
  month: '',
  startTime: '',
  endTime: '',
  selectYear:'',
});
const operateStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case operateAnalysisAction.OPERATESTATIONDATA_FETCH:
      return state.set('loading', true)
    case operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_FIled:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))

  }
  return state;
}
export default operateStationAnalysisReducer;
