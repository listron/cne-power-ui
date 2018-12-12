import Immutable from 'immutable';
import { transferAction } from './transferAction';

var initState = Immutable.fromJS({
  loading: false,
  
});


const transferReducer = (state = initState, action) => {
  switch (action.type) {
    case transferAction.transferFetch:
      return state.set('loading',true)
    case transferAction.getTransferFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case transferAction.changeTransferStore:
      return state.merge(Immutable.fromJS(action.payload))
    case transferAction.RESET_STORE:
      return initState
  }
  return state;
}

export default transferReducer;