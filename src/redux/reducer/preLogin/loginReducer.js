import immutable from 'immutable';

import {
  CHANGE_PRELOGIN_PAGE
} from '../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  loginLoading: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  loginTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  // registerStep: 1,//注册企业步骤关键字，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内

});

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_PRELOGIN_PAGE:
      return state.set('commonFetching', true)
  }
  return state;
}


export default loginReducer;