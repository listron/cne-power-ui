import immutable from 'immutable';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import { getCookie } from '../../utils';

var initState = immutable.fromJS({
  isFetching: false,
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  registerStep: 1,//注册企业步骤，1-账户验证，2-企业信息，3-完善个人信息==》优先写页面内
  joinStep: 1,//加入企业步骤，1-输入企业，2-手机号验证，3-完善个人信息==》优先写页面内
  domainIsRegister: '2',//域名 0-无效，1-有效
  nameIsRegister: '2',//企业名称 0-已注册，1-未注册
  error: {},
  phoneNum: '',//手机号
  verificationCode: '',//验证码
  loginData: {},//登录返回信息
  enterpriseInfo: {
    enterpriseDomain: null,
    enterpriseId: null,
    enterpriseLogo: null,
    enterpriseName: null,
  },//加入企业信息
  showResetPassword: 0,//显示重置密码页面 0 不显示 1 显示
  enterpriseDomain: '',//注册企业域名
  enterpriseName: null,//注册企业名称
  joinResult: 0,//0 加入失败，1，加入待审核
  enterpriseId: getCookie('enterpriseId'),
});

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case LoginAction.CHANGE_LOGIN_STORE:
      return state.merge(immutable.fromJS(action.params)).set('isFetching', false);
    case LoginAction.LOGIN_FETCH:
      return state.set('isFetching', true);
    case LoginAction.GET_LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('loginData', immutable.fromJS(action.data));
    case LoginAction.SEND_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('phoneNum', action.params.phoneNum);
    case LoginAction.CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('showResetPassword', action.params.showResetPassword !== undefined ? action.params.showResetPassword:0)
                  .set('loginData', immutable.fromJS(action.data));
    case LoginAction.PHONE_CODE_REGISTER_SUCCESS:
      return state.merge(immutable.fromJS(action.params)).set('isFetching', false);
    case LoginAction.GET_ENTERPRISE_INFO_SUCCESS:
      return state.set('isFetching', false)
                  .set('enterpriseInfo', immutable.fromJS(action.data));
    case LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS:
      return state.set('domainIsRegister', action.data.isRegister)
                  .set('enterpriseDomain', action.params.enterpriseDomain);
    case LoginAction.CHECK_ENTERPRISE_NAME_SUCCESS:
      return state.set('isFetching', false)
                  .set('nameIsRegister', action.data.isRegister)
                  .set('enterpriseName', action.params.enterpriseName);
    case LoginAction.JOIN_ENTERPRISE_SUCCESS://此状态暂未使用，等待后端具体给出审核状态再做判断
      return state.set('isFetching', false)
                  .set('joinResult', action.data.joinResult);
    case LoginAction.GET_LOGIN_FAIL:
    case LoginAction.CHECK_CODE_FAIL:
    case LoginAction.PHONE_CODE_REGISTER_FAIL:
    case LoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL:
    case LoginAction.CHECK_ENTERPRISE_NAME_FAIL:
    case LoginAction.GET_ENTERPRISE_INFO_FAIL:
    case LoginAction.JOIN_ENTERPRISE_FAIL:
    case LoginAction.RESET_PASSWORD_FAIL:
    case LoginAction.REGISTER_ENTERPRISE_FAIL:
      return state.set('isFetching', false)
                  .set('error', immutable.fromJS(action.data));    
  }
  return state;
}


export default loginReducer;