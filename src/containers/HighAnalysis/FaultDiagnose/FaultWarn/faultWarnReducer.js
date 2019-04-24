import Immutable from 'immutable';
import { faultWarnAction } from './faultWarnAction.js';

const initState = Immutable.fromJS({
  loading: false,
});


const HistoryWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case faultWarnAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnAction.RESET_STORE:
      return initState
  }
  return state;
};

export default HistoryWarnReducer;
