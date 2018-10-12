

export const planAction = {
  PLAN_FETCH: Symbol('PLAN_FETCH'),//loading
  GET_PLAN_FETCH_SUCCESS: Symbol('GET_PLAN_FETCH_SUCCESS'),//部门普通api请求成功
  CHANGE_PLAN_STORE: Symbol('CHANGE_PLAN_STORE'),//替换reducer参数
  changePlanStore: Symbol('changePlanStore'),//改变reducer参数

  getPlanList: Symbol('getPlanList'),//获取生产计划的数据
  editPlanInfo: Symbol('editPlanInfo'),//编辑生产计划的数据
  addPlanInfo: Symbol('addPlanInfo'),//添加生产计划的数据
}




