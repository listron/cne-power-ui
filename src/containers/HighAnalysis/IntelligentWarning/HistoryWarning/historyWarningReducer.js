import Immutable from 'immutable';
import { historyWarningAction } from './historyWarningAction';

var initState = Immutable.fromJS({
  warningStatus:'',//历史预警
  warningType:'限值告警',//限值告警
  loading:false,
  warningTypeStatus:'0',//历史预警
  orderField:'1',
  orderCommand:'2',
  pageName:'list',
  durationType:null,
  warningLevel:[],//告警级别多个
  deviceTypeCode:[],//设备类型多个
  rangTime:[],//发生时间
  endTime:[],//结束时间
  // startTime:'',//开始时间
  // endTime:'',//结束时间
  deviceName:null,//设备名称
  pageSize:10,
  pageNum:1,
  total:0,
  stationCodes:[],//电站编码
  oneWarningNum:'--',//一级告警
  twoWarningNum: '--',//二级告警
  threeWarningNum: '--',//三级告警
  fourWarningNum:'--',//四级告警
  historyWarningList:[],//历史预警的列表
  ticketInfo:{},//工单详情
  relieveInfo:{},
  defectTypes:[],
  defectId: '',
});
const historyWarningReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case historyWarningAction.changeHistoryWarningStore:
      return state.merge(Immutable.fromJS(action.payload))
    case historyWarningAction.resetHistoryWarningStore:
      return initState
  }
  return state;
}
export default historyWarningReducer;
