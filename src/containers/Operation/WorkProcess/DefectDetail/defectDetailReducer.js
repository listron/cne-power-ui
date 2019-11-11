import immutable from 'immutable';
import moment from 'moment';

const defectDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  name: 'hjl',
});

const defectDetail = (state = initState, action) => {
  switch (action.type) {
    case defectDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case defectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case defectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { defectDetail, defectDetailAction };
