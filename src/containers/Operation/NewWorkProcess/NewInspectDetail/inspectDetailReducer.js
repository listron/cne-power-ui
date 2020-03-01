import immutable from 'immutable';
import moment from 'moment';

const newInspectDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getInspectDetail: Symbol('getInspectDetail'),
  setInspectCheck: Symbol('setInspectCheck'),
};

const initState = immutable.fromJS({
  loading: false,
  inspectDetail: {},
  inspectFlows: [],

});

const newInspectDetail = (state = initState, action) => {
  switch (action.type) {
    case newInspectDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case newInspectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case newInspectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { newInspectDetail, newInspectDetailAction };
