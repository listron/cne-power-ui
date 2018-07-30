import keyMirror from 'keymirror';

module.exports = {
  userAction: keyMirror({
    USER_FETCH : null,

    CHANGE_USER_STORE_SAGA: null,// 更改reducer
    CHANGE_USER_STORE_SUCCESS: null,

    GET_USER_COMMON_FETCH_SUCCESS: null,//公共请求API成功

    GET_USER_LIST_SAGA: null,//获取列表

    GET_USER_DETAIL_SAGA: null,//获取详情

    EDIT_USER_INFO_SAGA: null,//编辑用户

    CHANGE_USER_STATUS_SAGA: null,//改变用户状态

    CREATE_USER_INFO_SAGA: null,//新建用户信息
  })
}