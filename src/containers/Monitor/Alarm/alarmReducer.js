import Immutable from 'immutable';
import { alarmAction } from './alarmAction';

var initState = Immutable.fromJS({
  loading: false,
  //筛选条件
  warningLevel: [],//告警级别
  stationType: '2',//电站类型
  stationCode: [],//电站名称
  deviceTypeCode: [],//设备类型
  warningConfigName: [],//告警类型
  startTime: [],//发生时间
  endTime: [],//结束时间
  deviceName: '',//设备名称，模糊查询
  warningStatus: [],//处理结果
  
  isTransferWork: 1,
  isRelieveAlarm: 1,

  alarmNum: {},
  realtimeAlarm: [],  // 实时告警
  historyAlarm: [],  // 历史告警
  selectedRowKeys: [], //表格选中的行key
  defectTypes: [],
  lastUpdateTime: '',
  ticketInfo: {},
  relieveInfo: {},

  sortMethod: '', //排序方式 
  sortName: '', // 排序名字
  pageSize: 10, 
  currentPage: 1, // 页数

  pageName: 'list',//用于已转工单，list和 detail
  defectId: '', // 用于已转工单 缺陷ID 即转工单id
  stationCodes:[],// 只用于已转工单
  rangTime:[],// 发生时间 只用于已转工单

});

const alarmReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmAction.ALARM_FETCH:
      return state.set('loading', true);
    case alarmAction.GET_ALARM_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case alarmAction.CHANGE_ALARM_STORE_SAGA:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmAction.RESET_ALARM:
      return initState;
  }
  return state;
}


export default alarmReducer;