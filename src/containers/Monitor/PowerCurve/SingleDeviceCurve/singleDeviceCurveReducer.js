import immutable from 'immutable';
import { singleDeviceCurveAction } from './singleDeviceCurveAction';
const initState = immutable.fromJS({
  // stationCode:'',
  // allDeviceCurveData:[],//多设备图表数据
  // stationDeviceTypes: [], // 电站下可选设备类型


});

const singleDeviceCurveReducer = (state = initState, action) => {
  switch (action.type) {
    case singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case singleDeviceCurveAction.changeSingleDeviceStore:
      return state.merge(immutable.fromJS(action.payload));
    case singleDeviceCurveAction.RESET_SINGLEDEVICECURVE:
      return initState;
  }
  return state;
}

export default singleDeviceCurveReducer ;
