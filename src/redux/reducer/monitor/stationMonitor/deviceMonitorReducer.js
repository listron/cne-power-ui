import immutable from 'immutable';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationmonitor/deviceAction';

var initState = immutable.fromJS({
  loading: false,
  // deviceCode: '',  // 暂不用
  // deviceName: '',  // 暂不用
  // deviceTypeCode: '',  // 暂不用
  // deviceTypeName: '',  // 暂不用

  deviceDetail: {},  // 单设备详情
  deviceTenMin: [],  // 但设备10min数据
  devicePointData: [],  // 设备测点数据
  deviceAlarmList: [],  // 设备告警列表
});

const deviceMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceAction.MONITOR_DEVICE_FETCH:
      return state.set('loading',true)
    case deviceAction.GET_DEVICE_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case deviceAction.CHANGE_DEVICE_MONITOR_STORE:
      return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default deviceMonitorReducer;
