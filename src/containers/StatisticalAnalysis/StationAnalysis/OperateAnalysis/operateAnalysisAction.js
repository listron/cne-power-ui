export const operateAnalysisAction = {
  OPERATESTATIONDATA_FETCH: Symbol(' OPERATESTATIONDATA_FETCH'),//loading
  GET_OPERATESTATIONDATA_FETCH_SUCCESS: Symbol('GET_OPERATESTATIONDATA_FETCH_SUCCESS'),//请求成功 
  CHANGE_OPERATESTATIONDATA_STORE_SAGA: Symbol('CHANGE_OPERATESTATIONDATA_STORE_SAGA'),//改变默认参数
  CHANGE_OPERATESTATIONDATA_STORE: Symbol('CHANGE_OPERATESTATIONDATA_STORE'),//改变默认参数
  getOperatePlanComplete: Symbol('getOperatePlanComplete'),//计划完成情况
  getComponentPowerStatistic: Symbol('getComponentPowerStatistic'),//月/年/日组件发电量统计
  getAllStationAvalibaData: Symbol('getComponentPowerStatistic'),//月/年/日 是否有数据

  getUsageRate: Symbol('getUsageRate'),//月/年/日可利用率
  getLostPowerType: Symbol('getLostPowerType'),//月/年/日电量损失类型	
  getLimitPowerRate: Symbol('getLimitPowerRate'),//月/日限电率同比
  getYearLimitPowerRate: Symbol('getYearLimitPowerRate'),//月/日年限电率环比
  getPlantPower: Symbol('getPlantPower'),//月/年/日厂用电情况/厂损情况
  getPowerEfficiency: Symbol('getPowerEfficiency'),//月/年/日发电效率
  getlostPower: Symbol('getlostPower'),//月/年/日 损失电量
}
