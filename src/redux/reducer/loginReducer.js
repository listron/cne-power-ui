import immutable from 'immutable';
import { LoginAction } from '../../constants/actionTypes/loginAction';

var initState = immutable.fromJS({
  isFetching: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  registerStep: 1,//注册企业步骤关键字，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  joinInStep: 1,//加入企业步骤：1-输入企业名称，2-手机号验证，3-创建用户名密码 
  domainIsRegister: '2',//域名 0-无效，1-有效
  nameIsRegister: '2',//企业名称 0-已注册，1-未注册
  isJoined: 0,// 0 用户未加入过企业；1：用户加入过企业
  // isRegister: 1,
  error: {
    code: '',
    message: '',
  },
  phoneNum: '',//手机号
  verificationCode: '',//验证码
  user: {
    userName: '',
    userId: '',
  },//用户信息
  enterpriseInfo: {},//加入企业信息
  showConfirmPassword: false,//显示确认密码页面
  enterpriseDomian: '',//注册企业域名
  enterpriseName: '',//注册企业名称
  isUserRegister: '2',//'0' 用户名已注册 '1' 用户名未注册
  isPhoneRegister: '2',//'0' 已注册 '1' 未注册
});

const loginReducer = (state = initState, action) => {
  console.log(action);
  console.log(state.toJS())
  switch (action.type) {
    case LoginAction.CHANGE_LOGIN_PAGE:
      return state.set('pageTab', action.params.pageTab);
    case LoginAction.LOGIN_FETCH:
      return state.set('isFetching', true);
    case LoginAction.GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginSuccess', true)
                  .set('user', immutable.fromJS(action.data));
    case LoginAction.GET_ENTERPRISE_INFO_SUCCESS:
      return state.set('isFetching', false)
                  .set('enterpriseInfo', immutable.fromJS(action.data.data))
    case LoginAction.SEND_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('phoneNum', action.params.phoneNum);
    case LoginAction.CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('phoneNum', action.params.phoneNum)
                  .set('enterpriseId', action.data.data.enterpriseId);
    case LoginAction.CHECK_PHONE_REGISTER_SUCCESS:
      return state.set('isPhoneRegister', action.data.isRegister)
    case LoginAction.PHONE_CODE_REGISTER_SUCCESS:
      return state.set('isFetching', false)
                  .set('registerStep', 2);
    case LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS:
      return state.set('domainIsRegister', action.data.data.isRegister)
                  .set('enterpriseDomian', action.params.enterpriseDomian);
    case LoginAction.CHECK_ENTERPRISE_NAME_SUCCESS:
      return state.set('isFetching', false)
                  .set('nameIsRegister', action.data.data.isRegister)
                  .set('enterpriseName', action.params.enterpriseName);
    case LoginAction.CHECK_USER_REGISTER_SUCCESS:
      return state.set('isFetching', false)
                  .set('isUserRegister', action.data.data.isRegister);
    case LoginAction.CHECK_PHONE_REGISTER_FAIL:
    case LoginAction.SEND_CODE_FAIL:
    case LoginAction.GET_LOGIN_FAIL:
    case LoginAction.CHECK_CODE_FAIL:
    case LoginAction.CHECK_PHONE_REGISTER_FAIL:
    case LoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL:
    case LoginAction.CHECK_ENTERPRISE_NAME_FAIL:
      return state.set('isFetching', false)
                  .set('error', immutable.fromJS(action.data.error));    
  }
  return state;
}


export default loginReducer;