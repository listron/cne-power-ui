import immutable from 'immutable';
import {
  BEGIN_FETCH,
  UPDATE_COUNT,
  GET_COMPINFO_SUCCESS,
  GET_COMPINFO_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  // CHECK_PHONE_FAIL,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAIL,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
  CHANGE_PSW_SUCCESS,
  CHANGE_PSW_FAIL,
  GET_COMPINFO_SU_SUCCESS,
  GET_COMPINFO_SU_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  GET_SHOW_STATUS_SUCCESS,
  GET_SHOW_STATUS_FAIL,
  CHANGE_SHOW_STATUS_SUCCESS,
  CHANGE_SHOW_STATUS_FAIL,
  CREATE_REGISTER_SUCCESS,
  CREATE_REGISTER_FAIL,
  // CHECK_PHONE_SU_FAIL
} from '../../constants/actionTypes/Login';

var initState = immutable.fromJS({
  status: true,//是否显示邀请链接
  link: '',
  isFetching: false,
  error: '',
  count: 0,
  phone: {
    value: '',
    correct: false
  },
  code: {
    value: '',
    correct: false
  },
  user: {
    userName:'',
    userId:'',
  },
  domain: {
    name:'',
    logo:''
  }
});

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isFetching', true);
    case UPDATE_COUNT:
      return state.set('count', action.number)
    case GET_COMPINFO_SUCCESS:
    case GET_COMPINFO_SU_SUCCESS:  
      return state.set('isFetching', false)
                  .set('domain', immutable.fromJS({
                    name: action.data.enterpriseName,
                    logo: action.data.enterpriseLogUrl
                  }));
    case LOGIN_SUCCESS:
      return state.set('isFetching', false)
                  .set('user', immutable.fromJS(action.data));    
    // case CHECK_PHONE_FAIL:
    //   return { 
    //     ...state, 
    //     errorType:'phone',
    //     msg:'手机号未注册',
    //     phone:action.phone
    //   }
    case SEND_CODE_SUCCESS:
      return state.set('phone', immutable.fromJS({
                    value: action.data.phone,
                    correct: true
                  }));  
    case SEND_CODE_FAIL:
      return state.set('error', action.data.error)
                  .set('phone', immutable.fromJS({
                    value: action.data.phone,
                    correct: false
                  }));
    case CHECK_CODE_SUCCESS:
      return state.set('isFetching', false)
                  .set('code', immutable.fromJS({
                    value: action.data.code,
                    correct: true
                  }));
    case CHECK_CODE_FAIL:
      return state.set('isFetching', false)
                  .set('error', action.data.error)
                  .set('code', immutable.fromJS({
                    value: action.data.code,
                    correct: false
                  }));
    case CHANGE_PSW_SUCCESS:
      return state.set('isFetching', false);      
    case SIGNUP_SUCCESS:
      return state.set('isFetching', false)
                  .set('user', immutable.fromJS(action.data));
    // case CHECK_PHONE_SU_FAIL:
    //   return { 
    //     ...state,
    //     errorType:'phone',
    //     msg:action.data.error,
    //     phone:action.data.phone  
    //   }
    case GET_SHOW_STATUS_SUCCESS:
    case CHANGE_SHOW_STATUS_SUCCESS:
      return state.set('isFetching', false)
                  .set("status", action.data.status);
    case CREATE_REGISTER_SUCCESS:
      return state.set('isFetching', false)
                  .set("link", action.data.link);  
    case GET_COMPINFO_FAIL:
    case GET_COMPINFO_SU_FAIL:
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
    case CHANGE_PSW_FAIL:
    case GET_SHOW_STATUS_FAIL:
    case CHANGE_SHOW_STATUS_FAIL:
    case CREATE_REGISTER_FAIL:
      return state.set('isFetching', false)
                  .set('error', action.data.error);
  }
  return state;
}


export default loginReducer;