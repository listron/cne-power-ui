export const productionAnalysisAction = {
  PRODUCTIONSTATIONDATA_FETCH: Symbol(' PRODUCTIONSTATIONDATA_FETCH'),//loading
  GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS: Symbol('GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS'),//请求成功 
  CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA: Symbol('CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA'),//改变默认参数
  CHANGE_PRODUCTIONSTATIONDATA_STORE: Symbol('CHANGE_PRODUCTIONSTATIONDATA_STORE'),//改变默认参数
  ProductionPlanComplete: Symbol('ProductionPlanComplete'),//
  getSingleStationProductionData: Symbol('getSingleStationProductionData'),
  getSingleStationPlanRateData: Symbol('getSingleStationPlanRateData'),
  getAllStationAvalibaData: Symbol('getAllStationAvalibaData'),

  RESET_STORE:Symbol('RESET_STORE'),
  resetStore:Symbol('resetStore'), // 重置
}
