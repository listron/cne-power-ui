import Immutable from 'immutable';

import { productionAnalysisAction } from './productionAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  year: null,
  stationCode: null,
  month: '',
  startTime: '',
  endTime: '',
  selectYear: '',
  allStationAvalibaData: [],  // 计划完成情况(判断数据)
  productionPlanCompleteData: [],  // 计划完成情况
  singleStationPowerData: [], //发电量
  singleStationBuyPowerData: [], // 购买电量
  singleStationSalePowerData: [],  // 上网电量
  singleStationPlanRateData: [],  // 计划完成率

});
const productionStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH:
      return state.set('loading', true)
    case productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case productionAnalysisAction.RESET_STORE:
      return initState
  }
  return state;
}
export default productionStationAnalysisReducer;
