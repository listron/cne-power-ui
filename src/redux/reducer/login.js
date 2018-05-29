import {
  GET_COMPINFO_SUCCESS,
  GET_COMPINFO_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CHECK_PHONE_SUCCESS,
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

const loginReducer = (state = {
  login:{
    fetched:false,
    phone:'',
    userName:'',
    userId:'',
  },
  domain: {
    fetched:false,
    name:'',
    logo:'',
    id:'',
  },
  phone: {
    fetched:false,
    phone:'',
  },
  code: {
    fetched:false,
    error:false,
    isRight:false,
  },
  psw:{
    fetched:false,
    error:false,
  },
  info:{
    fetched:false,
    name:'',
    logo:'',
    id:'',
  },
  signup:{
    fetched:false,
  },
  error:null,  
  msg:'',
}, action) => {
  switch (action.type) {
    case GET_COMPINFO_SUCCESS:   
      return { 
        ...state, 
        domain: {
          fetched:true,
          name:action.domain.enterpriseName,
          id:action.domain.enterpriseId
        } 
      }
    case GET_COMPINFO_FAIL:
      return { 
        ...state, 
        error:true,
        msg:action.error,
      }
    case LOGIN_SUCCESS:
      return { 
        ...state, 
        login: {
          fetched:true,
          userId:action.login.userId,
          userName:action.login.userName
        } 
      }    
    case LOGIN_FAIL:
      return { 
        ...state, 
        error:true,
        msg:action.error,
      }
    case CHECK_PHONE_SUCCESS:
      return { 
        ...state, 
        phone: {
          fetched:true,
          phone:action.phone.phone          
        } 
      }    
    case CHECK_PHONE_FAIL:
      return { 
        ...state, 
        phone: {
          fetched:false,
          error:true,
          msg:'手机号未注册',
          phone:action.phone.phone          
        } 
      }

    case SEND_CODE_SUCCESS:
      return { 
        ...state, 
        code: {
          fetched:true,
          phone:action.phone.phone          
        } 
      }    
    case SEND_CODE_FAIL:
      return { 
        ...state, 
        code: {
          fetched:false,
          error:true,
          msg:action.phone.error,
          phone:action.phone.phone                   
        } 
      }
    case CHECK_CODE_SUCCESS:
      return { 
        ...state, 
        code: {
          isRight:true,
          code:action.code.code,
          phone:action.code.phone
        } 
      }    
    case CHECK_CODE_FAIL:
      return { 
        ...state, 
        code: {
          isRight:false,
          error:true,
          code:action.code.code,         
          msg:action.code.error,
        } 
    }
    case CHANGE_PSW_SUCCESS:
      return { 
        ...state, 
        psw: {
          fetched:true
        } 
      }    
    case CHANGE_PSW_FAIL:
      return { 
        ...state, 
        psw: {
          error:true,
          msg:action.error,
        } 
    }
    case GET_COMPINFO_SU_SUCCESS:
      return { 
        ...state, 
        info: {
          fetched:true,
          name:action.info.enterpriseName,
          logo:action.info.enterpriseLogUrl,
          id:action.info.enterpriseId,
        }
      }    
    case GET_COMPINFO_SU_FAIL:
      return { 
        ...state, 
        info: {
          error:true,
          msg:action.error,
        } 
    }
    case SIGNUP_SUCCESS:
      return { 
        ...state, 
        signup: {
          fetched:true,
          userId:action.signup.userId,
          userName:action.signup.userName,
          phone:action.signup.phone
        },
        login:{
          fetched:true
        }
      }    
    case SIGNUP_FAIL:
      return { 
        ...state, 
        signup: {
          error:true,
          msg:action.error,
        } 
    }
    case CHECK_PHONE_SU_FAIL:
      return { 
        ...state, 
        phone: {
          fetched:false,
          error:true,
          msg:action.phone.error,
          phone:action.phone.phone          
        }
      }
  }
  return state
}


export default loginReducer