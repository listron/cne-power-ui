import Immutable from 'immutable';

import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  year: null,
  stationCode: null,
  month: '',
  startTime: '',
  endTime: '',
  selectYear: '',
  resourceAvalibaData:[], //计划完成是否有数据
  resourcePlanData:[],  // 计划完成情况
  PvCompareData:[],  //月/日单电站光资源同比
  YearPvCompareData:[], //年单电站光资源
  resourceMonthLight:[], //月/日光资源分布
  resourceYearLight:[], //年光资源分布
  resourceMonthWeather:{},  //月/年天气预报
  resourceDayWeather:{} //日天气预报
});
const stationResourceAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH:
      return state.set('loading', true)
    case stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case stationResourceAnalysisAction.RESET_STORE:
      return initState
  }
  return state;
}
export default stationResourceAnalysisReducer;
