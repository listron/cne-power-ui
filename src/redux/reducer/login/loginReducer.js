import immutable from 'immutable';

import {

} from '../../constants/actionTypes/loginAction';

var initState = immutable.fromJS({
  loginLoading: false,
  loginSuccess:false,

});

const loginReducer = (state = initState, action) => {
  // switch (action.type) {
  //   case COMMON_FETCH:
  //     return state.set('commonFetching', true)
  // }
  return state;
}


export default loginReducer;