
import keyMirror from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/keymirror';

module.exports = {
  enterpriseAction: keyMirror({

    ENTERPRISE_FETCH: null,//loading
    CHANGE_ENTERPRISE_STORE_SAGA: null,//改变reducer参数
    CHANGE_ENTERPRISE_STORE: null,//替换reducer参数
    GET_ENTERPRISE_LIST_SAGA: null,//获取企业列表
    SAVE_ENTERPRISE_INFO_SAGA: null,//企业详情保存(编辑+新增)
    GET_ENTERPRISE_FETCH_SUCCESS: null,//api请求成功
    GET_ENTERPRISE_DETAIL_SAGA: null,//获取企业详情
    IGNORE_ENTERPRISE_EDIT: null,//忽略企业编辑提示
  })
}





