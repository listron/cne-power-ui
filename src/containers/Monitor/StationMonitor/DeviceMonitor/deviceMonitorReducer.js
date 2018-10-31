import Immutable from 'immutable';
import { deviceAction } from './deviceAction';

var initState = Immutable.fromJS({
  loading: false,
  // deviceCode: '',  // 暂不用
  // deviceName: '',  // 暂不用
  // deviceTypeCode: '',  // 暂不用
  // deviceTypeName: '',  // 暂不用
  devices: [],       // 电站下同设备类型的设备列表
  deviceDetail: {},  // 单设备详情
  deviceTenMin: [],  // 单设备10min数据
  devicePointData: [],  // 设备测点数据
  deviceAlarmList: [],  // 设备告警列表
});

const deviceMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceAction.MONITOR_DEVICE_FETCH:
      return state.set('loading',true)
    case deviceAction.GET_DEVICE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case deviceAction.CHANGE_DEVICE_MONITOR_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case deviceAction.RESET_DEVICE_MONITOR_STORE_SUCCESS:
      return initState;
  }
  return state;
}


export default deviceMonitorReducer;
