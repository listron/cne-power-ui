import Immutable from "immutable";
import {performanceAnalysisAction} from "./performanceAnalysisAction";

const initState = Immutable.fromJS({
  loading: false, 
  stationCode: null,

  efficialList:[],
})

const performanceAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case performanceAnalysisAction.ALLSTATIONDATA_FETCH:
      return state.set('loading',true)
    case performanceAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case performanceAnalysisAction.CHANGE_ALLSTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
   
  }
  return state;
}


export default performanceAnalysisReducer;