import immutable from 'immutable';
import { LoginAction } from '../../constants/actionTypes/loginAction';

var initState = immutable.fromJS({
  isFetching: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  loginMethod: 'password', //登录方式 password，phoneCheck，QRcode
  phoneCodeNext: 'login',//验证手机号验证码的下一步 login/join/register/forget 
  registerStep: 1,//注册企业步骤，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  joinStep: 1,//加入企业步骤，1-输入企业，2-手机号验证，3-完善个人信息==》优先写页面内
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
  enterpriseInfo: {
    enterpriseDomain: null,
    enterpriseId: null,
    enterpriseLogo: null,
    enterpriseName: null,
  },//加入企业信息
  showResetPassword: 0,//显示重置密码页面 0 不显示 1 显示
  enterpriseDomian: '',//注册企业域名
  enterpriseName: null,//注册企业名称
  isUserRegister: '2',//'0' 用户名已注册 '1' 用户名未注册
  isPhoneRegister: '2',//'0' 已注册 '1' 未注册
  enterpriseId: '',//登录判断用户是否在企业里
  username: '',//判断是否完善个人信息
  joinResult: 0,//0 加入失败，1 加入成功
  registerSuccess: 2,//0 失败 1 成功
});

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case LoginAction.CHANGE_LOGIN_STORE:
      return state.merge(immutable.fromJS(action.params));
    case LoginAction.CHANGE_JOIN_STEP_SUCCESS:
      return state.set('joinStep', action.params.joinStep)
    case LoginAction.LOGIN_FETCH:
      return state.set('isFetching', true);
    case LoginAction.GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginSuccess', true)
                  .set('user', immutable.fromJS(action.data));
    case LoginAction.GET_ENTERPRISE_INFO_SUCCESS:
      return state.set('isFetching', false)
                  .set('enterpriseInfo', immutable.fromJS(action.data))
    case LoginAction.SEND_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('phoneNum', action.params.phoneNum);
    case LoginAction.CHECK_CODE_SUCCESS:
      return state.merge(immutable.fromJS(action.payload)).set('isFetching', false);
    case LoginAction.CHECK_PHONE_REGISTER_SUCCESS:
      return state.set('isPhoneRegister', action.data.isRegister)
    case LoginAction.PHONE_CODE_REGISTER_SUCCESS:
      return state.set('phoneNum', action.params.phoneNum);
    case LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS:
      return state.set('domainIsRegister', action.data.isRegister)
                  .set('enterpriseDomian', action.params.enterpriseDomian);
    case LoginAction.CHECK_ENTERPRISE_NAME_SUCCESS:
      return state.set('isFetching', false)
                  .set('nameIsRegister', action.data.isRegister)
                  .set('enterpriseName', action.params.enterpriseName)
    case LoginAction.CHECK_USER_REGISTER_SUCCESS:
      return state.set('isFetching', false)
                  .set('isUserRegister', action.data.isRegister);
    case LoginAction.JOIN_ENTERPRISE_SUCCESS:
      return state.set('isFetching', false)
                  .set('joinResult', 1)
                  .set('joinStep', 1);
    case LoginAction.REGISTER_ENTERPRISE_SUCCESS:
      return state.set('isFetching', false)
                  .set('registerSuccess', 1)
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