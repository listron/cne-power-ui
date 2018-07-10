import immutable from 'immutable';

// import {
//   CHANGE_PRELOGIN_PAGE,
//   LOGIN_FETCH,
// } from '../../constants/actionTypes/preLoginAction';
import { 
  LOGIN_FETCH,
  GET_LOGIN_SUCCESS, 
  GET_LOGIN_FAIL,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAIL,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
} from '../../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  loginLoading: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  registerStep: 1,//注册企业步骤关键字，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  isFetching: false,
  error: '',
  count: 0,
  phone:{
    value: '',
    correct: false,
  },
  code: {
    value: '',
    correct: false,
  },
  user: {
    userName: '',
    userId: '',
  },
  domain: {
    name: '',
    logo: false,
  }
});

const loginReducer = (state = initState, action) => {
  console.log(action)
  switch (action.type) {
    case LOGIN_FETCH:
      return state.set('isFetching', true)
    case GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginSuccess', true)
                  .set('user', immutable.fromJS(action.data))
    case SEND_CODE_SUCCESS:
      return state.set('phone', immutable.fromJS({
                    value: action.data.phone,
                    correct: false,
                  }))
    case SEND_CODE_FAIL:
      return state.set('phone', immutable.fromJS({
                    value: action.data.phone,
                    correct: true,
                  }))
    case CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('code', immutable.fromJS({
                    value: action.data.code,
                    correct: false,
                  }))
    case CHECK_CODE_FAIL:
      return state.set('isFetching', false)
                  .set('code', immutable.fromJS({
                    value: action.data.code,
                    correct: false,
                  }))
    // case CHANGE_PRELOGIN_PAGE:
    //   return state.set('commonFetching', true)
    case GET_LOGIN_FAIL:
      return state.set('isFetching', false)
                  .set('error', action.data.error)
  }
  return state;
}


export default loginReducer;