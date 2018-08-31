import Immutable from 'immutable';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';

var initState = Immutable.fromJS({
  loading: false,//加载状态
  stationList: [],//所有电站列表
  singleStationData: {},//单电站数据
  stationType: 0,//电站类型  0：风 1：光
  capabilityData: [],//出力图数据
  powerData: [],//理论发电量 实际发电量数据
  operatorList: [],//企业运维人员列表
  weatherList: [],//天气列表
  alarmList: {},//告警数统计
  workList: {},//工单数统计
  deviceTypeFlow: [],//设备类型示意图
  deviceTypeCode: 509,//当前显示设备列表code值 默认显示光伏组件
  pvmoduleList: [],//光伏组件列表
  inverterList: {},//逆变器列表
  boxTransformerList: [],//箱变列表
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