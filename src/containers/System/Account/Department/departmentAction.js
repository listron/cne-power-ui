

export const departmentAction = {

  DEPARTMENT_FETCH: Symbol('DEPARTMENT_FETCH'),//loading
  CHANGE_DEPARTMENT_STORE_SAGA: Symbol('CHANGE_DEPARTMENT_STORE_SAGA'),//改变reducer参数
  CHANGE_DEPARTMENT_STORE: Symbol('CHANGE_DEPARTMENT_STORE'),//替换reducer参数
  GET_DEPARTMENT_FETCH_SUCCESS: Symbol('GET_DEPARTMENT_FETCH_SUCCESS'),//部门普通api请求成功

  getDepartmentList: Symbol('getDepartmentList'),//获取部门列表
  deleteDepartment: Symbol('deleteDepartment'), //删除部门
  addDepartmentInfo: Symbol('addDepartmentInfo'),//部门新增
  getDepartmentUser: Symbol('getDepartmentUser'), //获取所属企业所有用户
  GET_ALL_DEPARTMENT_SAGA: Symbol('GET_ALL_DEPARTMENT_SAGA'), //获取所有部门
  GET_DEPARTMENT_STATION_SAGA: Symbol('GET_DEPARTMENT_STATION_SAGA'),//获取所有电站
  editDepartmentInfo: Symbol('editDepartmentInfo'),//部门信息编辑
  setDepartmentUser: Symbol('setDepartmentUser'),//分配部门用户
  SET_DEPARTMENT_STATION_SAGA: Symbol('SET_DEPARTMENT_STATION_SAGA'),//分配部门电站
  getDepartmentDetail: Symbol('getDepartmentDetail'),//获取部门详情
  getOtherPageDetail: Symbol('getOtherPageDetail'),//获取其他页某一条部门详情
}

// DEPARTMENT_FETCH: null,//loading
//     CHANGE_DEPARTMENT_STORE_SAGA: null,//改变reducer参数
//     CHANGE_DEPARTMENT_STORE: null,//替换reducer参数
//     GET_ALL_DEPARTMENT_SAGA: null, //获取所有部门
//     GET_DEPARTMENT_STATION_SAGA: null,//获取所有电站
//     SET_DEPARTMENT_STATION_SAGA: null,//分配部门电站
//     GET_DEPARTMENT_FETCH_SUCCESS: null,//部门普通api请求成功




