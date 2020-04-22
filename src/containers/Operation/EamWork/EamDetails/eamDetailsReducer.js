import immutable from 'immutable';
import { eamDetailsAction } from './eamDetailsAction';
const initState = immutable.fromJS({
  loading: false,
});

const eamDetailsReducer = (state = initState, action) => {
  switch (action.type) {
    case eamDetailsAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamDetailsAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamDetailsAction.resetStore:
      return initState;
  }
  return state;
};

export default eamDetailsReducer;
