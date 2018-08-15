import Immutable from 'immutable';

import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';

var initState = Immutable.fromJS({
   loading: false,
   allMonitorStation:{},//实时数据汇总
   stationDataSummary:{},//电站实时数据汇总
   stationDataList:[],//电站实时数据列表
   pageNum: 1,//当前页号
   pageSize: 10,//每页容纳条数
  totalNum: 0,//数据总数

});
const stationMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAction. ALL_MONITORSTATION_FETCH:
      return state.set('loading',true)
    case allStationAction.GET_MONITORSTATION_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
      case allStationAction. WIND_MONITORSTATION_FETCH:
      return state.set('loading',true)
    case allStationAction.GET_WIND_MONITORSTATION_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
      case allStationAction. PV_MONITORSTATION_FETCH:
      return state.set('loading',true)
    case allStationAction.GET_PV_MONITORSTATION_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case allStationAction.CHANGE_MONITORSTATION_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}
export default stationMonitorReducer;
