import immutable from 'immutable';

export const runAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDevices: Symbol('getDevices'),
};

const initState = immutable.fromJS({
  modesInfo: [],
  modeDevices: [],
});

export const achieveRun = (state = initState, action) => {
  switch (action.type) {
    case runAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case runAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case runAchieveAction.resetStore:
      return initState;
  }
  return state;
};
