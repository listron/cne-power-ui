
import keyMirror from 'keymirror';

module.exports = {
  departmentAction: keyMirror({

    DEPARTMENT_FETCH: null,//loading
    CHANGE_DEPARTMENT_STORE_SAGA: null,//改变reducer参数
    CHANGE_DEPARTMENT_STORE_SUCCESS: null,//替换reducer参数
    GET_DEPARTMENT_LIST_SAGA: null,//获取部门列表
    ADD_DEPARTMENT_INFO_SAGA: null,//部门新增
    EDIT_DEPARTMENT_INFO_SAGA: null,//部门信息编辑
    GET_DEPARTMENT_COMMON_FETCH_SUCCESS: null,//部门普通api请求成功
    GET_DEPARTMENT_DETAIL_SAGA: null,//获取部门详情
  })
}





