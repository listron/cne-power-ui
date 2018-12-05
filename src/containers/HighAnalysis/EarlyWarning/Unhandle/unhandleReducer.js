import Immutable from 'immutable';
import { unhandleAction } from './unhandleAction';

var initState = Immutable.fromJS({
  loading: false,
  
});

const UnhandleReducer = (state = initState, action) => {
  switch (action.type) {
    case unhandleAction.unhadleFetch:
      return state.set('loading',true)
    case unhandleAction.getUnhandleFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case unhandleAction.changeUnhandleStore:
      return state.merge(Immutable.fromJS(action.payload))
    case unhandleAction.RESET_STORE:
      return initState
  }
  return state;
}

export default UnhandleReducer;