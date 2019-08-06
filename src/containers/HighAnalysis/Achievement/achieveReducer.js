import immutable from 'immutable';

export const achieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getAreaStation: Symbol('getAreaStation'),
  getQuotaInfo: Symbol('getQuotaInfo'),
  getModesInfo: Symbol('getModesInfo'),
};

const initState = immutable.fromJS({
  areaStation: [],
  quotaInfo: [],
  modesInfo: [], // 厂家 + 型号
});

export const achieveLayout = (state = initState, action) => {
  switch (action.type) {
    case achieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case achieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case achieveAction.resetStore:
      return initState;
  }
  return state;
};
