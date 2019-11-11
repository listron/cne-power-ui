import immutable from 'immutable';
import moment from 'moment';

const inspectDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  name: 'hjl',
});

const inspectDetail = (state = initState, action) => {
  switch (action.type) {
    case inspectDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case inspectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case inspectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { inspectDetail, inspectDetailAction };
