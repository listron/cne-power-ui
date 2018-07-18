import immutable from 'immutable';
import { LoginAction } from '../../constants/actionTypes/loginAction';

var initState = immutable.fromJS({
  isFetching: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  registerStep: 1,//注册企业步骤关键字，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  joinInStep: 1,//加入企业步骤：1-输入企业名称，2-手机号验证，3-创建用户名密码 
  // isRegister: 1,
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
    case LoginAction.CHANGE_LOGIN_PAGE:
      return state.set('pageTab', action.params.pageTab);
    case LoginAction.LOGIN_FETCH:
      return state.set('isFetching', true);
    case LoginAction.GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginSuccess', true)
                  .set('user', immutable.fromJS(action.data));
    case LoginAction.SEND_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('phone', action.data.phone);
    case LoginAction.CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('code', action.data.code);
    case LoginAction.CHECK_PHONE_REGISTER_SUCCESS:
      return state.set('isFetching', false)
                  .set('registerStep', 2);
    case LoginAction.CHECK_PHONE_REGISTER_FAIL:
    case LoginAction.SEND_CODE_FAIL:
    case LoginAction.GET_LOGIN_FAIL:
    case LoginAction.CHECK_CODE_FAIL:
    case LoginAction.CHECK_PHONE_REGISTER_FAIL:
      return state.set('isFetching', false)
                  .set('error', immutable.fromJS(action.data.error));
    
  }
  return state;
}


export default loginReducer;