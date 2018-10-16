import Immutable from 'immutable';

import { operateAnalysisAction } from './operateAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType:'month',
  year:'2018',
 


});
const operateStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case operateAnalysisAction.OPERATESTATIONDATA_FETCH:
      return state.set('loading',true)
    case operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
   
  }
  return state;
}
export default operateStationAnalysisReducer;
