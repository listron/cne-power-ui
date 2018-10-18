import Immutable from 'immutable';

import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType:'month',
  year:'2018',
 


});
const stationResourceAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH:
      return state.set('loading',true)
    case stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
   
  }
  return state;
}
export default stationResourceAnalysisReducer;
