import immutable from 'immutable';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

var initState = immutable.fromJS({
  loading: false,
  loginSuccess:false, //展示登录页和功能页的唯一区分标识
  pageTab: 'login',//四个页关键字：longin,register,joinIn,forget
  joinInStep: 1,//加入企业步骤：1-输入企业名称，2-手机号验证，3-创建用户名密码
  isExist: 0,// 0 输入的企业不存在；1: 输入的企业存在
  isJoined: 0,// 0 用户未加入过企业；1：用户加入过企业
  isFetching: false,
  error: {
    code: '',
    message: '',
  },
  enterpriseInfo: {
    enterpriseId: '',
    enterpriseName: '',
    enterpriseLogin: '',
    enterpriseDomain: '',
  }
});

const joinInReducer = (state = initState, action) => {
  console.log(action)
  switch (action.type) {
    case PreLoginAction.JOININ_FETCH:
      return state.set('loading', true);
    case PreLoginAction.GET_JOININ_COMMON_SUCCESS:
      return state.set('loading', false)
                  .merge(immutable.fromJS(action.payload))
                  .set('enterpriseInfo', immutable.fromJS(action.payload.data)) 
                  .set('isExist', 1)
                  .set('isJoined', 1)
  }
  return state;
}


export default joinInReducer;