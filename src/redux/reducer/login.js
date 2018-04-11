import {
  GET_COMINFO_SUCCESS,
  GET_COMINFO_FAIL,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
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
  }
  return state
}


export default loginReducer