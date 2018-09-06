import Immutable from 'immutable';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';

var initState = Immutable.fromJS({
  loading: false,

  //筛选条件
  showPage: 'multiple',//multiple,single

  stationType: '0',//电站类型
  stationCode: [],//电站名称

  startTime: '',//发生时间
  endTime: '',//结束时间
  deviceName: '',//设备名称，模糊查询

  summaryType: 2,//统计方式：1-按时，2-按日，3-按月
  singleStationCode: '',

  pageSize: null,
  pageNum: null,
  orderField: '',
  orderCommand: '',



  alarmStatistic: [],//多电站
  singleAlarmStatistic: [],//单电站
  singleAlarmSummary: {},//单电站告警汇总
});

const alarmStatisticReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmAction.ALARM_STATISTIC_FETCH:
      return state.set('loading',true);
    case alarmAction.GET_ALARM_STATISTIC_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case alarmAction.CHANGE_ALARM_STATISTIC_STORE_SAGA:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmAction.RESET_ALARM_STATISTIC:
      return initState;
  }
  return state;
}


export default alarmStatisticReducer;