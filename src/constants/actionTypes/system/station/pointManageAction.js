
import keyMirror from 'keymirror';

module.exports = {
    pointManageAction: keyMirror({
      POINT_MANAGE_FETCH: null, // loading
      CHANGE_POINT_MANAGE_STORE_SAGA: null, //改变reducer参数
      CHANGE_POINT_MANAGE_STORE: null, // 替换reducer参数

      GET_POINT_MANAGE_FETCH_SUCCESS: null, // 测点管理普通api请求成功
  })
}





