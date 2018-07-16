import { combineReducers } from 'redux'

import common from './commonReducer';
import users from './users';
import posts from './posts';
import login from './login';
import operation from './operation/operationReducer';
import preLogin from './preLogin/preLoginReducer';
import enterprise from './system/enterpriseReducer';
import department from './system/departmentReducer';

const appReducer =  combineReducers({common, users, posts, login, operation,preLogin,enterprise,department });

// ========================= 单独一个文件的写法 =============================
/* import { 
    GET_USERS_SUCESS, 
    GET_USERS_FAIL,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL
} from 'constant/actionTypes';

const initialState = { 
	fetched: false, 
	users: [{
		key: '1',
		name: '张三',
		email: 'zhangsan@126.com'
    }],
    posts: [{
        key: '1',
        id: '1',
        title: 'test'
    }],
	error: null
};

const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_USERS_SUCESS:
            return {...state, fetched: true, users: action.users} 
        case GET_USERS_FAIL:
            return {...state, error: action.error} 
        case GET_POSTS_SUCCESS:
            return {...state, fetched: true, posts: action.posts} 
        case GET_POSTS_FAIL:
            return {...state, error: action.error} 
    }
    return state;
} */


export default appReducer