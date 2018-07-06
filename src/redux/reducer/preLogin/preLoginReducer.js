import immutable from 'immutable';

import {
  CHANGE_PRELOGIN_PAGE
} from '../../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  pageTab:'login', //四个页面切换： login,register,joinIn,forget
});

const preLoginReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_PRELOGIN_PAGE:
      return state.set('pageTab', action.params.pageTab)
  }
  return state;
}


export default preLoginReducer;