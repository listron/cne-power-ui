import Immutable from 'immutable';
import { alarmAction } from './alarmAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  loading: false,
  allChartLoading: false,
  singleChartLoading: false,
  //筛选条件
  showPage: 'multiple', //multiple,single

  stationType: '1', //电站类型
  stationCode: [], //电站名称
  selectedStation: [],

  startTime: moment().subtract(6, 'days').hour(0).minute(0).second(0).utc().format(),
  endTime: moment().endOf('day').utc().format(),
  deviceName: '', //设备名称，模糊查询

  summaryType: 2, //统计方式：1-按时，2-按日，3-按月
  singleStationCode: '',

  pageSize: 10,
  pageNum: 1,
  orderField: '1',
  orderCommand: '1',

  alarmStatistic: [], //多电站
  singleAlarmStatistic: [], //单电站
  singleAlarmSummary: {}, //单电站告警汇总

  pvStartTime: moment().subtract(6, 'days').hour(0).minute(0).second(0).utc().format(), // 光伏电站开始时间
  pvEndTime: moment().endOf('day').utc().format(), // 光伏电站结束时间
  windStartTime: moment().subtract(6, 'days').hour(0).minute(0).second(0).utc().format(), // 风电电站开始时间
  windEndTime: moment().endOf('day').utc().format(), // 风电电站开始时间
  pvDate: '', // 记录光伏电站日期
  windDate: '', // 记录风电电站日期
});

const alarmStatisticReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmAction.ALARM_STATISTIC_FETCH:
      return state.set('loading', true);
    case alarmAction.GET_ALARM_STATISTIC_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case alarmAction.changeAlarmStatisticStore:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmAction.CHANGE_ALARM_STATISTIC_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmAction.RESET_ALARM_STATISTIC_SAGA:
      return initState;
  }
  return state;
};


export default alarmStatisticReducer;
