import Immutable from 'immutable';
import moment from 'moment';

import { operateAnalysisAction } from './operateAnalysisAction';

var initState = Immutable.fromJS({
  loading: false,
  dateType: 'month',
  year: null,
  stationCode: null,
  month: '',
  startTime: '',
  endTime: '',
  selectYear: '',  // 计划完成选择年
  operateAvalibaData: [], //计划完成是否有数据
  operatePlanCompleteData: {},  // 计划完成情况
  powerData: {}, // 发电量统计
  efficiencyData: [], // 发电效率
  usageData: [], // 可利用率
  lostPowerData: [],  //损失电量
  lostPowerTypeDatas: {},  // 电量损失类型
  limitPowerData: [], // 月／日限电率同比
  yearLimitPowerData: [],  // 年限电率
  plantPowerData: [] // 月/年/日厂用电情况/厂损情况
});
const operateStationAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case operateAnalysisAction.OPERATESTATIONDATA_FETCH:
      return state.set('loading', true)
    case operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_FIled:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case operateAnalysisAction.RESET_STORE:
      return initState
  }
  return state;
}
export default operateStationAnalysisReducer;
