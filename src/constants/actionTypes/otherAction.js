import keyMirror from 'keymirror';

module.exports ={
  otherAction: keyMirror({
    OTHER_FETCH: null, //loading状态管理
    CHANGE_OTHER_STORE_SAGA: null, // 触发store基础数据改变
    CHANGE_OTHER_STORE: null, // 替换改变other store基础数据
    GET_OTHER_FETCH_SUCCESS: null, // api请求后，请求数据取代store数据

    EDIT_PASSWORD_SAGA : null, // 修改密码
  })
}

