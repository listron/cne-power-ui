import {
  GET_COMINFO_SUCCESS,
  GET_COMINFO_FAIL,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
  CHECK_PHONE_SUCCESS,
  CHECK_PHONE_FAIL,
  GET_CODE_SUCCESS,
  GET_CODE_FAIL,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
  CHANGE_PSW_SUCCESS,
  CHANGE_PSW_FAIL,
  GET_COMINFOSU_SUCCESS,
  GET_COMINFOSU_FAIL,
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
  error:null,  
  msg:'',
}, action) => {
  let newState;
  switch (action.type) {
    case GET_COMINFO_SUCCESS:   
      return { 
        ...state, 
        domain: {
          fetched:true,
          name:action.domain.enterpriseName,
          id:action.domain.enterpriseId
        } 
      }
    case GET_COMINFO_FAIL:
      return { 
        ...state, 
        error:true,
        msg:action.error_msg,
      }
    case GET_LOGIN_SUCCESS:
      return { 
        ...state, 
        login: {
          fetched:true,
          userId:action.login.userId,
          userName:action.login.userName
        } 
      }    
    case GET_LOGIN_FAIL:
      return { 
        ...state, 
        error:true,
        msg:action.error_msg,
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

    case GET_CODE_SUCCESS:
      return { 
        ...state, 
        code: {
          fetched:true,
          phone:action.phone.phone          
        } 
      }    
    case GET_CODE_FAIL:
      return { 
        ...state, 
        code: {
          fetched:false,
          error:true,
          msg:action.phone.error_msg,
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
          msg:action.code.error_msg,
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
          msg:action.error_msg,
        } 
    }
    case GET_COMINFOSU_SUCCESS:
      return { 
        ...state, 
        info: {
          fetched:true,
          name:action.info.enterpriseName,
          logo:action.info.enterpriseLogUrl
        }
      }    
    case GET_COMINFOSU_FAIL:
      return { 
        ...state, 
        info: {
          error:true,
          msg:action.error_msg,
        } 
    }
  }
  return state
}


export default loginReducer