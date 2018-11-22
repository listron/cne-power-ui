import Immutable from "immutable";
import { performanceAnalysisAction } from "./performanceAnalysisAction";

const initState = Immutable.fromJS({
  loading: false,
  contrastSwitch: false,
  stationCode: null,
  deviceTypeCode: null,
  deviceModeTypeCode: null,
  electricLineCode: '',
  deviceModels: [],//设备型号
  deviceTypes:[],//设备类型
  deviceModelOther:[],
  startTime: '',
  endTime: '',
  contrastStartDate: '',
  contrastEndDate: '',
  targetTabs: '1',
  efficialList: [],
  eleLineCodeData: [],
  conversioneffData: [],
  hourData: [],
  availabilityData: [],
  lostPowerData: [],
  faultNumData: [],
  faultTimeData: [],
  conversioneffData: [],
  hourData: [],
  availabilityData: [],
  lostPowerData: [],
  faultNumData: [],
  faultTimeData: [],

})

const performanceAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH:
      return state.set('loading', true)
    case performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case performanceAnalysisAction.CHANGE_PERFORMANCEANALYSIS_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case performanceAnalysisAction.resetStore:
      return initState

  }
  return state;
}


export default performanceAnalysisReducer;