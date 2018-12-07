import Immutable from 'immutable';
import { ignoreAction } from './ignoreAction';

var initState = Immutable.fromJS({
  loading: false,
  
});

const IgnoreReducer = (state = initState, action) => {
  switch (action.type) {
    case ignoreAction.ignoreFetch:
      return state.set('loading',true)
    case ignoreAction.getIgnoreFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case ignoreAction.changeIgnoreStore:
      return state.merge(Immutable.fromJS(action.payload))
    case ignoreAction.RESET_STORE:
      return initState
  }
  return state;
}

export default IgnoreReducer;