import Immutable from 'immutable';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';

var initState = Immutable.fromJS({
  loading: false,//加载状态
  stationList: [],//所有电站列表
  singleStationData: {},//单电站数据
  stationType: 0,//电站类型  0：风 1：光
});

const singleStationReducer = (state = initState, action) => {
  switch (action.type) {
    // case singleStationAction.MONITORSTATION_FETCH:
    //   return state.set('loading',true)
    // case singleStationAction.GET_MONITORSTATION_FETCH_SUCCESS :
    //   return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    // case singleStationAction.CHANGE_MONITORSTATION_STORE:
    //   return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}


export default singleStationReducer;
