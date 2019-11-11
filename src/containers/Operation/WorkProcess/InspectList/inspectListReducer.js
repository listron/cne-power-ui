import immutable from 'immutable';
import moment from 'moment';

const inspectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  name: 'hjl',
});

const inspectList = (state = initState, action) => {
  switch (action.type) {
    case inspectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case inspectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case inspectListAction.resetStore:
      return initState;
  }
  return state;
};

export { inspectList, inspectListAction };
