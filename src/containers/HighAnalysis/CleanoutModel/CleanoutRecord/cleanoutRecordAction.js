

export const cleanoutRecordAction = {
  CLEANOUT_RECORD_FETCH: Symbol('CLEANOUT_RECORD_FETCH'), // loading
  GET_CLEANOUT_RECORD_FETCH_SUCCESS: Symbol('GET_CLEANOUT_RECORD_FETCH_SUCCESS'),
  CHANGE_CLEANOUT_RECORD_STORE_SAGA: Symbol('CHANGE_CLEANOUT_RECORD_STORE_SAGA'), // 改变reducer参数
  CHANGE_CLEANOUT_RECORD_STORE: Symbol('CHANGE_CLEANOUT_RECORD_STORE'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  //灰尘的两个图表
  getStationDust:Symbol('getStationDust'),
  getMatrixDust: Symbol('getMatrixDust'),
  //清洗模型的首页
  getMainList: Symbol('getMainList'),
  //清洗模型点击进入单电站清洗详情
  getDetailList: Symbol('getDetailList'),
  //加，编辑，获取，删除，清洗计划
  getAddCleanPlan: Symbol('getAddCleanPlan'),
  getEditCleanPlan: Symbol('getEditCleanPlan'),
  getCleanPlanDetail: Symbol('getCleanPlanDetail'),
  deleteCleanPlan: Symbol('deleteCleanPlan'),
  //加，编辑，获取，下雨清洗计划
  getAddRainPlan: Symbol('getAddRainPlan'),
  getEditRainPlan: Symbol('getEditRainPlan'),
  getRainPlanDetail: Symbol('getRainPlanDetail'),
  //清洗记录列表，增，编辑，获取，删记录
  getPlanRecordList: Symbol('getPlanRecordList'),
  getAddCleanRecord: Symbol('getAddCleanRecord'),
  editCleanRecord:Symbol('editCleanRecord'),
  getCleanRecordDetail: Symbol('getCleanRecordDetail'),
  deleteCleanRecord: Symbol('deleteCleanRecord'),
  //获取电站下的方阵
  getMatrix:Symbol('getMatrix'),
}





