import immutable from 'immutable';
const meterDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  selectedStation: [],
});

const meterDetail = (state = initState, action) => {
  switch (action.type) {
    case meterDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case meterDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case meterDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { meterDetail, meterDetailAction };
