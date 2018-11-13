import Immutable from 'immutable';
import { homepageAction } from './homepageAction';

const initState = Immutable.fromJS({
  loading: false,
  testNumber: 0,
});

const homepageReducer = (state = initState, action) => {
  switch (action.type) {
    case homepageAction.LOADING:
      return state.set('loading',true)
    case homepageAction.GET_HOMEPAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case homepageAction.changeHomepageStore:
      return state.merge(Immutable.fromJS(action.payload))
    case homepageAction.homepageReset:
      return initState
  }
  return state;
}

export default homepageReducer;