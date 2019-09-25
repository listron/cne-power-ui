export const allStationAnalysisAction = {
  // GET_ALLSTATIONDATA_SAGA: Symbol('GET_ALLSTATIONDATA_SAGA'),//	获取多电站数据分析
  ALLSTATIONDATA_FETCH: Symbol(' ALLSTATIONDATA_FETCH'), //loading
  GET_ALLSTATIONDATA_FETCH_SUCCESS: Symbol('GET_ALLSTATIONDATA_FETCH_SUCCESS'), //请求成功 
  CHANGE_ALLSTATIONDATA_STORE_SAGA: Symbol('CHANGE_ALLSTATIONDATA_STORE_SAGA'),
  CHANGE_ALLSTATIONDATA_STORE: Symbol('CHANGE_ALLSTATIONDATA_STORE'),
  resetStore: Symbol('resetStore'),
  getAllStationAvalibaData: Symbol('getAllStationAvalibaData'),
  getAllStationStatisticData: Symbol('getAllStationStatisticData'),
  getAllStationStatisticTableData: Symbol('getAllStationStatisticTableData'),
  getAllStationMonthBarData: Symbol('getAllStationMonthBarData'),
  getAllStationMonthPieData: Symbol('getAllStationMonthPieData'),
  getAllStationYearBarData: Symbol('getAllStationYearBarData'),
  getSingleStationStatisticData: Symbol('getSingleStationStatisticData'),
  getSingleStationTargetData: Symbol('getSingleStationTargetData'),
  getSingleStationMonthPieData: Symbol('getSingleStationMonthPieData'),
  getSingleStationYearTargetData: Symbol('getSingleStationYearTargetData'),
  getSingleStationPlanRateData: Symbol('getSingleStationPlanRateData'),
  getSingleStationDayCompleteRateData: Symbol('getSingleStationDayCompleteRateData'),
  getSingleStationPvCompareData: Symbol('getSingleStationPvCompareData'),
  getSingleStationYearPvCompareData: Symbol('getSingleStationYearPvCompareData'),
  getSingleStationPowerEffectiveData: Symbol('getSingleStationPowerEffectiveData'),
  exportAllstationTableData: Symbol('exportAllstationTableData'),


};
