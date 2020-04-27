import immutable from 'immutable';
const eamRegisterDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = immutable.fromJS({
  loading: false,
});

const eamRegisterDetail = (state = initState, action) => {
  switch (action.type) {
    case eamRegisterDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamRegisterDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamRegisterDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { eamRegisterDetail, eamRegisterDetailAction };
