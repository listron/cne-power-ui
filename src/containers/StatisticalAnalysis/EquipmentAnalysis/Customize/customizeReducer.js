import Immutable from 'immutable';
import { customizeAction } from './customizeAction';

var initState = Immutable.fromJS({
  
});


const CustomizeReducer = (state = initState, action) => {
  switch (action.type) {
    case customizeAction.changeCustomizeStore:
      return state.merge(Immutable.fromJS(action.payload))
    case customizeAction.RESET_STORE:
      return initState
  }
  return state;
}

export default CustomizeReducer;