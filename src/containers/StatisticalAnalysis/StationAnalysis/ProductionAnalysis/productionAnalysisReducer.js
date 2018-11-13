import Immutable from 'immutable';

import { productionAnalysisAction } from './productionAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  stationCode: '',
  year: '',
  month: '',
  allStationAvalibaData: [],
  productionPlanCompleteData: [],
  singleStationPowerData: [],
  singleStationBuyPowerData: [],
  singleStationSalePowerData: [],
  singleStationPlanRateData: [],
  selectYear:'',



});
const productionStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH:
      return state.set('loading', true)
    case productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))

  }
  return state;
}
export default productionStationAnalysisReducer;
