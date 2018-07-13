
import keyMirror from 'keymirror';

module.exports = {
  enterpriseAction: keyMirror({

    ENTERPRISE_FETCH: null,//loading
    GET_ENTERPRISE_ATTR_CHANGE_SAGA: null,//改变reducer参数
    CHANGE_ENTERPRISE_STORE_SUCCESS: null,//替换reducer参数
    GET_ENTERPRISE_LIST_SAGA: null,//获取企业列表
    SAVE_ENTERPRISE_INFO_SAGA: null,//企业详情保存(编辑+新增)
    GET_ENTERPRISE_COMMON_FETCH_SUCCESS: null,//api请求成功
    GET_ENTERPRISE_DETAIL_SAGA: null,//获取企业详情
    IGNORE_ENTERPRISE_EDIT: null,//忽略企业编辑提示
  })
}





