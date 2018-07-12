import keyMirror from 'keymirror';

module.exports ={
  PreLoginAction: keyMirror({
    CHANGE_PRELOGIN_PAGE : null,
    CHANGE_PRELOGIN_PAGE_SAGA : null,
    CHANGE_LOGIN_PAGE : null,

    LOGIN_FETCH : null,
    UPDATE_COUNT : null,
    BEGIN_COUNT : null,
    STOP_TASK : null,
    // 密码登录
    GET_LOGIN_SAGA : null,
    GET_LOGIN_SUCCESS : null,
    GET_LOGIN_FAIL : null,
    GET_COMPINFO_SAGA : null,
    GET_COMPINFO_SUCCESS : null,
    GET_COMPINFO_FAIL : null,
    // 登录用手机验证码
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
  })
}
