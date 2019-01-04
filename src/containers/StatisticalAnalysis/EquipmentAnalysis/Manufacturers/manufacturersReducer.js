import Immutable from 'immutable';
import { manufacturersAction } from './manufacturersAction';

var initState = Immutable.fromJS({
  
});


const ManufacturersReducer = (state = initState, action) => {
  switch (action.type) {
    case manufacturersAction.changeHistoryWarnStore:
      return state.merge(Immutable.fromJS(action.payload))
    case manufacturersAction.RESET_STORE:
      return initState
  }
  return state;
}

export default ManufacturersReducer;