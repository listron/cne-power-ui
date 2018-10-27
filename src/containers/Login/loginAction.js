
  export const loginAction = {
    CHANGE_LOGIN_PAGE_SAGA : Symbol('CHANGE_LOGIN_PAGE_SAGA'),
    CHANGE_LOGIN_PAGE : Symbol('CHANGE_LOGIN_PAGE'),
    CHANGE_LOGIN_STORE_SAGA: Symbol('CHANGE_LOGIN_STORE_SAGA'),
    CHANGE_LOGIN_STORE: Symbol('CHANGE_LOGIN_STORE'),
    LOGIN_FETCH : Symbol('LOGIN_FETCH'),
    UPDATE_COUNT : Symbol('UPDATE_COUNT'),
    BEGIN_COUNT : Symbol('BEGIN_COUNT'),
    STOP_TASK : Symbol('STOP_TASK'),
    GET_COMMON_DATA_SAGA: Symbol('GET_COMMON_DATA_SAGA'),//获取全电站需要的公共数据，例如getStations,getDeviecTypes,userName等
    // 登录
    USER_NAME_LOGIN_SAGA : Symbol('USER_NAME_LOGIN_SAGA'),
    USER_NAME_LOGIN_SUCCESS : Symbol('USER_NAME_LOGIN_SUCCESS'),
    USER_NAME_LOGIN_FAIL : Symbol('USER_NAME_LOGIN_FAIL'),
    GET_COMPINFO_SAGA : Symbol('GET_COMPINFO_SAGA'),
    GET_COMPINFO_SUCCESS : Symbol('GET_COMPINFO_SUCCESS'),
    GET_COMPINFO_FAIL : Symbol('GET_COMPINFO_FAIL'),
    SEND_CODE_SAGA : Symbol('SEND_CODE_SAGA'),
    SEND_CODE_SUCCESS : Symbol('SEND_CODE_SUCCESS'),
    PHONE_CODE_LOGIN_SAGA : Symbol('PHONE_CODE_LOGIN_SAGA'),
    PHONE_CODE_LOGIN_SUCCESS : Symbol('PHONE_CODE_LOGIN_SUCCESS'),
    PHONE_CODE_LOGIN_FAIL : Symbol('PHONE_CODE_LOGIN_FAIL'),
    // 注册用验证
    CHECK_PHONE_REGISTER_SAGA: Symbol('CHECK_PHONE_REGISTER_SAGA'),
    CHECK_PHONE_REGISTER_SUCCESS: Symbol('CHECK_PHONE_REGISTER_SUCCESS'),
    CHECK_PHONE_REGISTER_FAIL: Symbol('CHECK_PHONE_REGISTER_FAIL'),
    CHECK_ENTERPRISE_DOMAIN_SAGA: Symbol('CHECK_ENTERPRISE_DOMAIN_SAGA'),
    CHECK_ENTERPRISE_DOMAIN_SUCCESS:Symbol('CHECK_ENTERPRISE_DOMAIN_SUCCESS'),
    CHECK_ENTERPRISE_DOMAIN_FAIL: Symbol('CHECK_ENTERPRISE_DOMAIN_FAIL'),
    CHECK_ENTERPRISE_NAME_SAGA: Symbol('CHECK_ENTERPRISE_NAME_SAGA'),
    CHECK_ENTERPRISE_NAME_SUCCESS: Symbol('CHECK_ENTERPRISE_NAME_SUCCESS'),
    CHECK_ENTERPRISE_NAME_FAIL: Symbol('CHECK_ENTERPRISE_NAME_FAIL'),
    REGISTER_ENTERPRISE_SAGA: Symbol('REGISTER_ENTERPRISE_SAGA'),
    REGISTER_ENTERPRISE_FAIL: Symbol('REGISTER_ENTERPRISE_FAIL'),
    CHECK_USER_REGISTER_SAGA: Symbol('CHECK_USER_REGISTER_SAGA'),
    CHECK_USER_REGISTER_SUCCESS: Symbol('CHECK_USER_REGISTER_SUCCESS'),
    CHECK_USER_REGISTER_FAIL: Symbol('CHECK_USER_REGISTER_FAIL'),
    PHONE_CODE_REGISTER_SAGA: Symbol('PHONE_CODE_REGISTER_SAGA'),
    PHONE_CODE_REGISTER_SUCCESS: Symbol('PHONE_CODE_REGISTER_SUCCESS'),
    PHONE_CODE_REGISTER_FAIL: Symbol('PHONE_CODE_REGISTER_FAIL'),
    // 加入企业
    GET_JOININ_COMMON_SUCCESS: Symbol('GET_JOININ_COMMON_SUCCESS'),
    GET_ENTERPRISE_INFO_SAGA: Symbol('GET_ENTERPRISE_INFO_SAGA'),
    GET_ENTERPRISE_INFO_SUCCESS: Symbol('GET_ENTERPRISE_INFO_SUCCESS'),
    GET_ENTERPRISE_INFO_FAIL: Symbol('GET_ENTERPRISE_INFO_FAIL'),
    JOIN_ENTERPRISE_SAGA: Symbol('JOIN_ENTERPRISE_SAGA'),
    JOIN_ENTERPRISE_SUCCESS: Symbol('JOIN_ENTERPRISE_SUCCESS'),
    JOIN_ENTERPRISE_FAIL: Symbol('JOIN_ENTERPRISE_FAIL'),
    CHANGE_JOIN_STEP_SAGA: Symbol('CHANGE_JOIN_STEP_SAGA'),
    CHANGE_JOIN_STEP_SUCCESS: Symbol('CHANGE_JOIN_STEP_SUCCESS'),
    CHANGE_JOIN_STEP_FAIL: Symbol('CHANGE_JOIN_STEP_FAIL'),
    // 重置密码
    RESET_PASSWORD_SAGA: Symbol('RESET_PASSWORD_SAGA'),
    RESET_PASSWORD_FAIL: Symbol('RESET_PASSWORD_FAIL'),
    // 离开重置state
    RESET_LOGIN_STORE_SAGA: Symbol('RESET_LOGIN_STORE_SAGA'),
    RESET_LOGIN_STORE_SUCCESS: Symbol('RESET_LOGIN_STORE_SUCCESS'),
    INVITE_USER_LINK_SAGA: Symbol('INVITE_USER_LINK_SAGA'),//请求邀请企业信息
    INVITE_USER_LINK_SUCCESS: Symbol('INVITE_USER_LINK_SUCCESS'),//请求邀请企业信息成功
  }
