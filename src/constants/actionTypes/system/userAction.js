import keyMirror from 'keymirror';

module.exports = {
  userAction: keyMirror({
    USER_FETCH : null,

    GET_USER_ATTR_CHANGE_SAGA: null,// 更改reducer
    GET_USER_ATTR_CHANGE_SUCCESS: null,

    GET_USER_COMMON_FETCH_SUCCESS: null,//公共请求API成功

    GET_USER_LIST_SAGA: null,//获取列表

    GET_USER_DETAIL_SAGA: null,//获取详情

    GET_USER_EDIT_SAGA: null,//编辑/新建用户
  })
}