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
} from '../../constants/actionTypes';

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
  },
  code: {
    fetched:false,
    error:false,
    isRight:false,
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
          code:action.code.code
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
  }
  return state
}


export default loginReducer