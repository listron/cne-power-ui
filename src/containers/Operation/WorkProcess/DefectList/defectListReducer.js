import immutable from 'immutable';
import moment from 'moment';

const defectListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({

});

const defectList = (state = initState, action) => {
  switch (action.type) {
    case defectListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case defectListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case defectListAction.resetStore:
      return initState;
  }
  return state;
};

export { defectList, defectListAction };
