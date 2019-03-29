import Immutable from 'immutable';

const loginAction = {
  CHANGE_LOGIN_STORE: Symbol('CHANGE_LOGIN_STORE'), // 修改reducer
  FETCH_LOGIN_SUCCESS: Symbol('FETCH_LOGIN_SUCCESS'), // api请求成功
  LOGIN_STORE_RESET: Symbol('LOGIN_STORE_RESET'), // 重置数据

  userNameLogin: Symbol('userNameLogin'), //  用户名+密码登录
  getVerificationCode: Symbol('getVerificationCode'), // 获取短信验证码
  phoneCodeLogin: Symbol('phoneCodeLogin'), // 手机号+密码登录
  phoneCodeRegister: Symbol('phoneCodeRegister'), // 检查手机号+验证码是否正确
  checkEnterpriseDomain: Symbol('checkEnterpriseDomain'), // 检查域名是否有效
  checkEnterpriseName: Symbol('checkEnterpriseName'), // 检查企业名是否已注册
  registerEnterprise: Symbol('registerEnterprise'), // 注册企业 完善个人信息
  getEnterPriseInfo: Symbol('getEnterPriseInfo'), // 获取企业信息
  joinEnterprise: Symbol('joinEnterprise'), // 加入企业
  resetPassword: Symbol('resetPassword'), // 设置新密码
  inviteUserLink: Symbol('inviteUserLink'), // 邀请用户加入企业(获取邀请企业信息)
}

const initState = Immutable.fromJS({
  loginLoading: false, // 登录的loading状态。
  pageTab: 'login', // 四页面关键字：login登录, register注册, joinIn加入企业, forget忘记密码,

  loginType: 'username', // 记录用户登录方式 username || phoneNumber
  loginResponse: {}, // 调用登录后后台返回数据的信息, => 正常登录存储localStorage信息, 异常的登录根据内部信息进行判定。 
  // loginResponse.userEnterpriseStatus: 3, // 用户状态 3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
  // loginResponse.userAuto: null, // 0 正常用户， 1导入/生成用户 => 需完善密码
  loginErrorInfo: false, // 提示用户名或密码错误

  enterpriseInfo: {}, // 企业基本信息 
  joinStep: 1,//加入企业步骤，1-输入企业，2-手机号验证，3-完善个人信息
  // loading: false,
  // registerStep: 1,//注册企业步骤，1-账户验证，2-企业信息，3-完善个人信息
  // joinStep: 1,//加入企业步骤，1-输入企业，2-手机号验证，3-完善个人信息
  // domainIsRegister: '2',//域名 0-无效，1-有效
  // nameIsRegister: '2',//企业名称 0-已注册，1-未注册
  // error: {},
  
  // verificationCode: '',//验证码
  // loginData: {},//登录返回信息
  // enterpriseInfo: {
  //   enterpriseDomain: null,
  //   enterpriseId: null,
  //   enterpriseLogo: null,
  //   enterpriseName: null,
  // },//加入企业信息
  // showResetPassword: 0,//显示重置密码页面 0 不显示 1 显示
  // enterpriseDomain: '',//注册企业域名
  // enterpriseName: null,//注册企业名称
  // joinResult: 0,//0 加入失败，1，加入待审核
  // enterpriseId: Cookie.get('enterpriseId'),
  // inviteUser: false,//false普通用户加入 true邀请用户加入
  // importUser: false,//false普通用户加入,true导入用户加入
  // inviteValid: true,//true邀请链接默认有效 
  // userEnterpriseStatus: 3,//用户企业状态  默认3启用
  // checkLoginPhone: true,//登录用手机号错误
  // importEnterpriseName: '',//导入企业名称
  // importEnterpriseLogo: '',//导入企业Logo地址
  // importEnterpriseId: '',//导入企业Id
});

const login = (state = initState, action) => {
  switch (action.type) {
    case loginAction.CHANGE_LOGIN_STORE :
      return state.merge(Immutable.fromJS(action.payload));
    case loginAction.FETCH_LOGIN_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload));
    case loginAction.RESET_lOGIN_STORE:
      return initState;
  }
  return state;
}

// const loginReducer = (state = initState, action) => {
//   switch (action.type) {
//     case loginAction.CHANGE_LOGIN_STORE:
//       return state.merge(Immutable.fromJS(action.params)).set('loading', false);
//     case loginAction.LOGIN_FETCH:
//       return state.set('loading', true);
//     case loginAction.USER_NAME_LOGIN_SUCCESS:
//       return state.set('loading', false)
//                   .set('loginData', Immutable.fromJS(action.data));
//     case loginAction.SEND_CODE_SUCCESS:
//       return state.set('loading', false)
//                   .set('phoneNum', action.params.phoneNum);
//     case loginAction.PHONE_CODE_LOGIN_SUCCESS:
//       return state.set('loading', false)
//                   .set('showResetPassword', action.params.showResetPassword !== undefined ? action.params.showResetPassword:0)
//                   .set('registerStep', 2)
//                   .set('phoneNum', action.params.phoneNum)
//                   .set('loginData', Immutable.fromJS(action.data));
//     case loginAction.PHONE_CODE_REGISTER_SUCCESS:
//       return state.merge(Immutable.fromJS(action.params)).set('loading', false);
//     case loginAction.GET_ENTERPRISE_INFO_SUCCESS:
//       return state.set('loading', false)
//                   .set('enterpriseInfo', Immutable.fromJS(action.data));
//     case loginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS:
//       return state.set('domainIsRegister', action.data.isRegister)
//                   .set('enterpriseDomain', action.params.enterpriseDomain);
//     case loginAction.CHECK_ENTERPRISE_NAME_SUCCESS:
//       return state.set('loading', false)
//                   .set('nameIsRegister', action.data.isRegister)
//                   .set('enterpriseName', action.params.enterpriseName);
//     case loginAction.JOIN_ENTERPRISE_SUCCESS:
//       return state.set('loading', false)
//                   .set('joinResult', action.data.joinResult);
//     case loginAction.INVITE_USER_LINK_SUCCESS:
//       return state.set('loading', false)
//                   .set('enterpriseInfo',Immutable.fromJS(action.data));
//     case loginAction.USER_NAME_LOGIN_FAIL:
//     case loginAction.PHONE_CODE_LOGIN_FAIL:
//     case loginAction.PHONE_CODE_REGISTER_FAIL:
//     case loginAction.CHECK_ENTERPRISE_DOMAIN_FAIL:
//     case loginAction.CHECK_ENTERPRISE_NAME_FAIL:
//     case loginAction.GET_ENTERPRISE_INFO_FAIL:
//     case loginAction.JOIN_ENTERPRISE_FAIL:
//     case loginAction.RESET_PASSWORD_FAIL:
//     case loginAction.REGISTER_ENTERPRISE_FAIL:
//       return state.set('loading', false)
//                   .set('error', Immutable.fromJS(action.data));
//     case loginAction.RESET_LOGIN_STORE_SUCCESS:
//       return initState;   
//   }
//   return state;
// }

export { loginAction, login };
