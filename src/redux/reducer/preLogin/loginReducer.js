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
  phone: '',
  code: '',
  user: {
    userName: '',
    userId: '',
  },
  domain: '',
});

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case PreLoginAction.LOGIN_FETCH:
      return state.set('isFetching', true)
    case PreLoginAction.GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginSuccess', true)
                  .set('user', immutable.fromJS(action.data))
    case PreLoginAction.SEND_CODE_SUCCESS:
      return state.set('phone', action.data.phone)
    case PreLoginAction.SEND_CODE_FAIL:
      return state.set('phone', action.data.phone)
    case PreLoginAction.CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('code', action.data.code)
    case PreLoginAction.CHECK_CODE_FAIL:
      return state.set('isFetching', false)
                  .set('code', action.data.code)
    case PreLoginAction.GET_LOGIN_FAIL:
      return state.set('isFetching', false)
                  .set('error', immutable.fromJS(action.data.error))
  }
  return state;
}


export default loginReducer;