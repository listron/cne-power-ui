import immutable from 'immutable';
import { allDeviceCurveAction } from './allDeviceCurveAction';
const initState = immutable.fromJS({
  stationCode:'',
  allDeviceCurveData:[],//多设备图表数据
  stationDeviceTypes: [], // 电站下可选设备类型


});

const allDeviceCurveReducer = (state = initState, action) => {
  switch (action.type) {
    case allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case allDeviceCurveAction.changeAllDeviceStore:
      return state.merge(immutable.fromJS(action.payload));
    case allDeviceCurveAction.RESET_ALLDEVICECURVE:
      return initState;
  }
  return state;
}

export default allDeviceCurveReducer;
