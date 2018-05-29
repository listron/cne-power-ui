import {
  GET_COMPINFO_SUCCESS,
  GET_COMPINFO_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CHECK_PHONE_FAIL,
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
  CHECK_PHONE_SU_FAIL,
} from '../../constants/actionTypes/Login';

var defaultState = {
  fetched: false,
  error: false,
  msg: '',
  phone:'',
  code: '', 
  user: {
    userName:'',
    userId:'',
  },
  domain: {
    name:'',
    logo:'',
    id:'',
  }
};

const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_COMPINFO_SUCCESS:
    case GET_COMPINFO_SU_SUCCESS:   
      return { 
        ...state, 
        fetched: true,
        domain: {
          name:action.data.enterpriseName,
          logo:action.data.enterpriseLogUrl,
          id:action.data.enterpriseId
        } 
      }
    case LOGIN_SUCCESS:
      return { 
        ...state,
        fetched: true,
        user: {
          userId:action.data.userId,
          userName:action.data.userName
        } 
      }     
    case CHECK_PHONE_FAIL:
      return { 
        ...state, 
        error:true,
        msg:'手机号未注册',
        phone:action.phone
      }
    case SEND_CODE_SUCCESS:
      return { 
        ...state,
        fetched:true,
        phone:action.phone  
      }    
    case SEND_CODE_FAIL:
      return { 
        ...state,
        error:true,
        msg:action.data.error,
        phone:action.data.phone 
      }
    case CHECK_CODE_SUCCESS:
      return { 
        ...state, 
        fetched: true,
        code:action.data.code,
        phone:action.data.phone
      }    
    case CHECK_CODE_FAIL:
      return { 
        ...state,
        error:true,
        code:action.data.code,
        phone:action.data.phone,         
        msg:action.data.error
      }
    case CHANGE_PSW_SUCCESS:
      return { 
        ...state, 
        fetched:true
      }      
    case SIGNUP_SUCCESS:
      return { 
        ...state, 
        fetched:true,
        phone:action.data.phone,
        user: {
          userId:action.data.userId,         
          userName:action.data.userName
        }
      }
    case CHECK_PHONE_SU_FAIL:
      return { 
        ...state,
        error:true,
        msg:action.data.error,
        phone:action.data.phone  
      }
    case GET_COMPINFO_FAIL:
    case LOGIN_FAIL:
    case CHANGE_PSW_FAIL:
    case GET_COMPINFO_SU_FAIL:
    case SIGNUP_FAIL:
      return { 
        ...state, 
        error:true,
        msg:action.error,
      }
  }
  return state
}


export default loginReducer