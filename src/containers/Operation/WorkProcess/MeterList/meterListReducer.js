import immutable from 'immutable';
const meterListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  selectedStation: [],
});

const meterList = (state = initState, action) => {
  switch (action.type) {
    case meterListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case meterListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case meterListAction.resetStore:
      return initState;
  }
  return state;
};

export { meterList, meterListAction };
