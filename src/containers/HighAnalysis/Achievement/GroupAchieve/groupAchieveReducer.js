import immutable from 'immutable';

export const groupAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  testGroup: [],
});

export const achieveLayout = (state = initState, action) => {
  switch (action.type) {
    case groupAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case groupAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case groupAchieveAction.resetStore:
      return initState;
  }
  return state;
};
