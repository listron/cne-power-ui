

export const departmentAction = {

  DEPARTMENT_FETCH: Symbol('DEPARTMENT_FETCH'),//loading
  changeDepartmentStore: Symbol('changeDepartmentStore'),//改变reducer参数
  CHANGE_DEPARTMENT_STORE: Symbol('CHANGE_DEPARTMENT_STORE'),//替换reducer参数
  GET_DEPARTMENT_FETCH_SUCCESS: Symbol('GET_DEPARTMENT_FETCH_SUCCESS'),//部门普通api请求成功

  getDepartmentList: Symbol('getDepartmentList'),//获取部门列表
  deleteDepartment: Symbol('deleteDepartment'), //删除部门
  addDepartmentInfo: Symbol('addDepartmentInfo'),//部门新增
  getDepartmentUser: Symbol('getDepartmentUser'), //获取所属企业所有用户
  getAllDepartment: Symbol('getAllDepartment'), //获取所有部门
  getDepartmentStation: Symbol('getDepartmentStation'),//获取所有电站
  editDepartmentInfo: Symbol('editDepartmentInfo'),//部门信息编辑
  setDepartmentUser: Symbol('setDepartmentUser'),//分配部门用户
  setDepartmentStation: Symbol('setDepartmentStation'),//分配部门电站
  getDepartmentDetail: Symbol('getDepartmentDetail'),//获取部门详情
  getOtherPageDetail: Symbol('getOtherPageDetail'),//获取其他页某一条部门详情
}




