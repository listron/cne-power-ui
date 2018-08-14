import Immutable from 'immutable';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/singleStationAction';

var initState = Immutable.fromJS({
  loading: false,//加载状态
  stationList: [],//所有电站列表
  singleStationData: {},//单电站数据
  stationType: 0,//电站类型  0：风 1：光
  capabilityData: [],//出力图数据
  powerData: [],//理论发电量 实际发电量数据
});

const singleStationReducer = (state = initState, action) => {
  switch (action.type) {
    case singleStationAction.SINGLE_STATION_FETCH:
      return state.set('loading',true)
    case singleStationAction.GET_SINGLE_STATION_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case singleStationAction.CHANGE_SINGLE_STATION_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}


export default singleStationReducer;
