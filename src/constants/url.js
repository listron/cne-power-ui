export const API_URL = 'http://10.10.11.224:8080';

export const GET_USERS_URL = 'https://jsonplaceholder.typicode.com/users';
export const GET_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
export const LOGIN_COMINFO = API_URL+'/api/v3/enterprise/domainLogin';
export const LOGIN_API_URL = API_URL+'/api/v3/user/userLogin';

export const CHECK_PHONE_URL = API_URL + '/api/v3/user/validateEnterpriseRegPhoneNum';
export const GET_CODE_URL = API_URL + '/api/v3/common/requestSmsCode';
export const CHECK_CODE_URL = API_URL + '/api/v3/user/validateCaptcha';
export const LOGOUT_URL = API_URL + "/api/v3/user/logout";
export const GET_RGLINK_URL = API_URL + "/api/v3/link/createRegisterLink";
export const GET_COMINFO_BYLINK_URL = API_URL + "/api/v3/link/queryEnterpriseInfoByLinkCode";
export const CHANGE_PSW_URL = API_URL +  '/api/v3/user/changeUserPassword';
