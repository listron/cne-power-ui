import immutable from 'immutable';

export const stationAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  testStation: Symbol('testStation'),
};

const initState = immutable.fromJS({
  testStationInfo: [],
});

export const achieveStation = (state = initState, action) => {
  switch (action.type) {
    case stationAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case stationAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case stationAchieveAction.resetStore:
      return initState;
  }
  return state;
};
