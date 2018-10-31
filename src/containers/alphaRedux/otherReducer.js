import Immutable from 'immutable';
import { otherAction } from './otherAction';

var initState = Immutable.fromJS({
  loading: false,
});

const otherReducer = (state = initState, action) => {
  switch (action.type) {
    case otherAction.OTHER_FETCH:
      return state.set('loading', true)
    case otherAction.CHANGE_OTHER_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case otherAction.GET_OTHER_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
  }
  return state;
}

export default otherReducer;