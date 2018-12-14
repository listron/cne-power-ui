import Immutable from 'immutable';
import { historyWarnAction } from './historyWarnAction';

var initState = Immutable.fromJS({
  loading: false,
  
});


const HistoryWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case historyWarnAction.historyWarnFetch:
      return state.set('loading',true)
    case historyWarnAction.getHistoryWarnFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case historyWarnAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload))
    case historyWarnAction.RESET_STORE:
      return initState
  }
  return state;
}

export default HistoryWarnReducer;