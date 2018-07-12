import immutable from 'immutable';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  joinInStep: 1,//加入企业步骤：1-输入企业名称，2-手机号验证，3-创建用户名密码
  isFetching: false,
  error: {
    code: '',
    message: '',
  },
  isRegister: 1,
});

const registerReducer = (state = initState, action) => {
  switch (action.type) {
    case PreLoginAction.CHECK_PHONE_REGISTER_SUCCESS:
      return state.set('registerStep', 2)
    case PreLoginAction.CHECK_PHONE_REGISTER_FAIL:
      return state.set('error', immutable.fromJS(action.data.error))
                  .set('phone', action.data.phone)
  }
  return state;
}


export default registerReducer;