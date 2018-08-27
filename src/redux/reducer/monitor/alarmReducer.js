import Immutable from 'immutable';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';

var initState = Immutable.fromJS({
  loading: false,
  lastFetchTime: '',

  //筛选条件
  warningLevel: [],//告警级别
  stationType: '2',//电站类型
  stationCode: [],//电站名称
  deviceTypeCode: [],//设备类型
  warningConfigName: [],//告警类型
  startTime: [],//发生时间
  endTime: [],//结束时间
  deviceName: '',//设备名称，模糊查询
<<<<<<< HEAD
=======
  warningStatus: [],//处理结果

>>>>>>> upstream/dev
  alarmNum: {},
  realtimeAlarm: [],  // 实时告警
  historyAlarm: [],  // 历史告警
  lastUpdateTime: '',
  ticketInfo: {},
  relieveInfo: {}
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