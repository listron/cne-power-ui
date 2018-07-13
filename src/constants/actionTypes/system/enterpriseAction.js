
import keyMirror from 'keymirror';

module.exports = {
  enterpriseAction: keyMirror({

    ENTERPRISE_FETCH: null,
    GET_ENTERPRISE_ATTR_CHANGE_SAGA: null,
    GET_ENTERPRISE_ATTR_CHANGE_SUCCESS: null,

    GET_ENTERPRISE_LIST_SAGA: null,
    SAVE_ENTERPRISE_INFO_SAGA: null,//企业详情保存(编辑+新增)

    GET_ENTERPRISE_COMMON_FETCH_SUCCESS: null,
    
    GET_ENTERPRISE_DETAIL_SAGA: null,
  })
}





