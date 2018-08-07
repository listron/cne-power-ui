import immutable from '../../../../../node_modules/_immutable@3.8.2@immutable';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/singleStationAction';

var initState = immutable.fromJS({
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
    //   return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    // case singleStationAction.CHANGE_MONITORSTATION_STORE:
    //   return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default singleStationReducer;
