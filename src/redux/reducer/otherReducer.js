import Immutable from 'immutable';
import { otherAction } from '../../constants/actionTypes/otherAction';

var initState = Immutable.fromJS({
  loading: false
});

const otherReducer = (state = initState, action) => {
  switch (action.type) {
    case otherAction.OTHER_FETCH:
      return state.set('commonFetching', true)
    case otherAction.CHANGE_OTHER_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case otherAction.GET_OTHER_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('commonFetching', false)
  }
  return state;
}

export default otherReducer;