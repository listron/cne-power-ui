

export const cleanWarningAction = {
  CLEAN_WARNING_FETCH: Symbol('CLEAN_WARNING_FETCH'), // loading
  GET_CLEAN_WARNING_FETCH_SUCCESS: Symbol('GET_CLEAN_WARNING_FETCH_SUCCESS'), // api request success
  CHANGE_CLEAN_WARNING_STORE: Symbol('CHANGE_CLEAN_WARNING_STORE'), // change store data
  RESET_STORE: Symbol('RESET_STORE'), // reset

  getCleanWarningList: Symbol('getCleanWarningList'), // 清洗预警列表
  getCleanWarningDetail: Symbol('getCleanWarningDetail'), // 选中预警详情
  getTotalDustEffect: Symbol('getTotalDustEffect'), // 全局灰尘影响
  getMatrixDustEffect: Symbol('getMatrixDustEffect'), // 方阵灰尘影响
}





