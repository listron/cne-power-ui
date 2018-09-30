

export const departmentAction = {

  DEPARTMENT_FETCH: Symbol('DEPARTMENT_FETCH'),//loading
  CHANGE_DEPARTMENT_STORE_SAGA: Symbol('CHANGE_DEPARTMENT_STORE_SAGA'),//改变reducer参数
  CHANGE_DEPARTMENT_STORE: Symbol('CHANGE_DEPARTMENT_STORE'),//替换reducer参数
  GET_DEPARTMENT_LIST_SAGA: Symbol('getDepartmentList'),//获取部门列表
  DELETE_DEPARTMENT_SAGA: Symbol('deleteDepartment'), //删除部门
  ADD_DEPARTMENT_INFO_SAGA: Symbol('ADD_DEPARTMENT_INFO_SAGA'),//部门新增
  GET_DEPARTMENT_USER_SAGA: Symbol('GET_DEPARTMENT_USER_SAGA'), //获取所属企业所有用户
  GET_ALL_DEPARTMENT_SAGA: Symbol('GET_ALL_DEPARTMENT_SAGA'), //获取所有部门
  GET_DEPARTMENT_STATION_SAGA: Symbol('GET_DEPARTMENT_STATION_SAGA'),//获取所有电站
  EDIT_DEPARTMENT_INFO_SAGA: Symbol('EDIT_DEPARTMENT_INFO_SAGA'),//部门信息编辑
  SET_DEPARTMENT_USER_SAGA: Symbol('SET_DEPARTMENT_USER_SAGA'),//分配部门用户
  SET_DEPARTMENT_STATION_SAGA: Symbol('SET_DEPARTMENT_STATION_SAGA'),//分配部门电站
  GET_DEPARTMENT_FETCH_SUCCESS: Symbol('GET_DEPARTMENT_FETCH_SUCCESS'),//部门普通api请求成功
  GET_DEPARTMENT_DETAIL_SAGA: Symbol('GET_DEPARTMENT_DETAIL_SAGA'),//获取部门详情
  GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA: Symbol('GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA'),//获取其他页某一条部门详情
}

// DEPARTMENT_FETCH: null,//loading
//     CHANGE_DEPARTMENT_STORE_SAGA: null,//改变reducer参数
//     CHANGE_DEPARTMENT_STORE: null,//替换reducer参数
//     GET_DEPARTMENT_LIST_SAGA: null,//获取部门列表
//     DELETE_DEPARTMENT_SAGA: null, //删除部门
//     ADD_DEPARTMENT_INFO_SAGA: null,//部门新增
//     GET_DEPARTMENT_USER_SAGA: null, //获取所属企业所有用户
//     GET_ALL_DEPARTMENT_SAGA: null, //获取所有部门
//     GET_DEPARTMENT_STATION_SAGA: null,//获取所有电站
//     EDIT_DEPARTMENT_INFO_SAGA: null,//部门信息编辑
//     SET_DEPARTMENT_USER_SAGA: null,//分配部门用户
//     SET_DEPARTMENT_STATION_SAGA: null,//分配部门电站
//     GET_DEPARTMENT_FETCH_SUCCESS: null,//部门普通api请求成功
//     GET_DEPARTMENT_DETAIL_SAGA: null,//获取部门详情
//     GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA: null,//获取其他页某一条部门详情




// export const enterpriseAction = {
//   fetching: Symbol('fetching'),//loading
//   changeEnterpriseStore: Symbol('changeEnterpriseStore'),//改变reducer参数
//   enterpriseRuducerReplace: Symbol('enterpriseRuducerReplace'),//替换reducer参数
//   getEnterprisList: Symbol('getEnterprisList'),//获取企业列表
//   saveEnterpriseInfor: Symbol('saveEnterpriseInfor'),//企业详情保存(编辑+新增)
//   enterpriseFetchSuccess: Symbol('enterpriseFetchSuccess'),//api请求成功
//   getEnterpriseDetail: Symbol('getEnterpriseDetail'),//获取企业详情
//   ignoreEnterpirseEdit: Symbol('ignoreEnterpirseEdit'),//忽略企业编辑提示
// }




