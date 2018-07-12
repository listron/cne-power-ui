import immutable from 'immutable';
import { combineReducers } from 'redux';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
var initState = immutable.fromJS({
  pageTab:'login', //四个页面切换： login,register,joinIn,forget
});

const preLoginReducer = (state = initState, action) => {
  switch (action.type) {
    case PreLoginAction.CHANGE_PRELOGIN_PAGE:
      return state.set('pageTab', action.params.pageTab)
  }
  return state;
}

const preLoginReducers = combineReducers({ preLoginReducer, loginReducer, registerReducer,  });
export default preLoginReducers;