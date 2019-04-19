import Immutable from 'immutable';
import { faultAllFanAction } from './faultAllFanAction.js';

const initState = Immutable.fromJS({
  loading: false,
});


const faultAllFanReducer = (state = initState, action) => {
  switch (action.type) {
    case faultAllFanAction.changeFaultAllFanStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultAllFanAction.fetchFaultAllFanSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultAllFanAction.RESET_STORE:
      return initState
  }
  return state;
};

export default faultAllFanReducer;
