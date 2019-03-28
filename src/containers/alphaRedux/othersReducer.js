import Immutable from 'immutable';
import { othersAction } from './othersAction';

const initState = Immutable.fromJS({
  loading: false,
})

const othersReducer = (state = initState, action) => {
  switch (action.type) {
    case othersAction.OTHERS_FETCH :
      return state.set('loading', true)
    case othersAction.CHANGE_OTHERS_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case othersAction.GET_OTHERS_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
  }
  return state;
}

export default othersReducer;