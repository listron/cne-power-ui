import immutable from 'immutable';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  loginLoading: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  registerStep: 1,//注册企业步骤关键字，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  isFetching: false,
  error: {
    code: '',
    message: '',
  },
  signupCount: 0,
  phone: '',
});

const registerReducer = (state = initState, action) => {
  switch (action.type) {
    case PreLoginAction.SIGNUP_SEND_CODE_SUCCESS:
      return state.set('phone', action.data.phone)
    case PreLoginAction.SIGNUP_SEND_CODE_FAIL:
      return state.set('error', immutable.fromJS(action.data.error))
                  .set('phone', action.data.phone)
  }
  return state;
}


export default registerReducer;