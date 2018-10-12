import Immutable from 'immutable';

import { allStationAnalysisAction } from './allStationAnalysisAction.js';

var initState = Immutable.fromJS({
  loading: false,
  timeSelect:'month',
  showPage: 'multiple',


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
