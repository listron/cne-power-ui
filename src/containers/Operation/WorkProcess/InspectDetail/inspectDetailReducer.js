import immutable from 'immutable';
import moment from 'moment';

const inspectDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getInspectDetail: Symbol('getInspectDetail'),
  setInspectCheck: Symbol('setInspectCheck'),
};

const initState = immutable.fromJS({
  loading: false,
  inspectDetail: {},
  inspectDeviceInfo: {},
  inspectFlows: [],

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
