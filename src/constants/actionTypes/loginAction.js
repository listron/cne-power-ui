import keyMirror from 'keymirror';

module.exports ={
  LoginAction: keyMirror({
    CHANGE_LOGIN_PAGE_SAGA : null,
    CHANGE_LOGIN_PAGE : null,

    LOGIN_FETCH : null,
    UPDATE_COUNT : null,
    BEGIN_COUNT : null,
    STOP_TASK : null,
    // 登录
    GET_LOGIN_SAGA : null,
    GET_LOGIN_SUCCESS : null,
    GET_LOGIN_FAIL : null,
    GET_COMPINFO_SAGA : null,
    GET_COMPINFO_SUCCESS : null,
    GET_COMPINFO_FAIL : null,
    SEND_CODE_SAGA : null,
    SEND_CODE_SUCCESS : null,
    SEND_CODE_FAIL : null,
    CHECK_CODE_SAGA : null,
    CHECK_CODE_SUCCESS : null,
    CHECK_CODE_FAIL : null,
    // 注册用验证
    CHECK_PHONE_REGISTER_SAGA: null,
    CHECK_PHONE_REGISTER_SUCCESS: null,
    CHECK_PHONE_REGISTER_FAIL: null,
    CHECK_ENTERPRISE_DOMAIN_SAGA: null,
    CHECK_ENTERPRISE_DOMAIN_SUCCESS:null,
    CHECK_ENTERPRISE_DOMAIN_FAIL: null,
    CHECK_ENTERPRISE_NAME_SAGA: null,
    CHECK_ENTERPRISE_NAME_SUCCESS: null,
    CHECK_ENTERPRISE_NAME_FAIL: null,
    // 加入企业
    GET_JOININ_COMMON_SUCCESS: null,
    GET_ENTERPRISE_INFO_SAGA: null,
    GET_ENTERPRISE_INFO_SUCCESS: null,
    GET_ENTERPRISE_INFO_FAIL: null,
    JOIN_ENTERPRISE_SAGA: null,
    JOIN_ENTERPRISE_SUCCESS: null,
    JOIN_ENTERPRISE_FAIL: null,
    // 重置密码
    RESET_PASSWORD_SAGA: null,
    RESET_PASSWORD_SUCCESS: null,
    RESET_PASSWORD_FAIL: null,
  })
}

