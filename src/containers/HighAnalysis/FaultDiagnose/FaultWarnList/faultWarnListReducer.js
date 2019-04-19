import Immutable from 'immutable';
import { faultWarnListAction } from './faultWarnListAction.js';

const initState = Immutable.fromJS({
  loading: false,
});


const fetchWarnListReducer = (state = initState, action) => {
  switch (action.type) {
    case faultWarnListAction.changeWarnListStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnListAction.fetchWarnListSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnListAction.RESET_STORE:
      return initState
  }
  return state;
};

export default fetchWarnListReducer;
