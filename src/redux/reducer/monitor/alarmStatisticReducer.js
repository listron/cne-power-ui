import Immutable from 'immutable';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';

var initState = Immutable.fromJS({
  loading: false,

  //筛选条件

  stationType: '0',//电站类型
  stationCode: [],//电站名称

  startTime: '',//发生时间
  endTime: '',//结束时间
  deviceName: '',//设备名称，模糊查询


  alarmStatistic: [],//多电站
  singleAlarmStatistic: [],//单电站
});

const alarmReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmAction.ALARM_FETCH:
      return state.set('loading',true);
    case alarmAction.GET_ALARM_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case alarmAction.CHANGE_ALARM_STORE_SAGA:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmAction.RESET_ALARM:
      return initState;
  }
  return state;
}


export default alarmReducer;