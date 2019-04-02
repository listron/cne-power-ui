import Immutable from 'immutable';
import { alarmCountAction } from './alarmCountAction.js';
import moment from 'moment'

var initState = Immutable.fromJS({
  showPage: 'multiple',//multiple  single
  singleStationCode: '',
  queryPramas: {
    stationType: '0', //电站类型
    stationCode: [], //电站名称
    startTime: moment().subtract(30, 'days').utc().format(), // 默认往前推30天
    endTime: moment().utc().format(),
    pageSize: 10,
    pageNum: 1,
    orderField: '',//1：电站名称 2告警总数3，一级总数，4：二级总数，5：三级总数，6：四级总数7平均处理时间，8：一级处理时间9：二级处理时间10：三级处理时间11：四级处理时间；
    orderCommand: "", // 1:ASC(升序)2:DESC(降序) 默认-1
    // warningType: '事件告警'
  },
  singleQueryPrams: {
    stationCode: '',
    startTime: moment().subtract(30, 'days').utc().format(), // 默认往前推30天
    endTime: moment().utc().format(),
    pageSize: 10,
    pageNum: 1,
    orderField: "1",  // 1：时间，2：总告警数3：转工单数4：未转工单数5：转工单率； 默认-1
    orderCommand: '1', // 1:ASC(升序)2:DESC(降序) 默认-1
    warningType: '事件告警',
  },
  alarmStatistic: [],//多电站
  singleAlarmStatistic: [],//单电站
  singleAlarmSummary: {},//单电站告警汇总
});


const alarmCountReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmCountAction.changeAlarmCountStore:
      return state.merge(Immutable.fromJS(action.payload))
    case alarmCountAction.resetStore:
      return initState
  }
  return state;
}
export default alarmCountReducer;