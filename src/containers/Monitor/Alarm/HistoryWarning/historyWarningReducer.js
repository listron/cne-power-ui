import Immutable from 'immutable';
import { historyWarningActive } from './historyWarningActive';

var initState = Immutable.fromJS({
  warningStatus:'',//历史预警
  warningType:'事件告警',//事件告警
  loading:false,
  stationType:'',
  warningTypeStatus:'0',//历史预警
  orderField:'',
  orderCommand:'',
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
  stationCodes:[],//电站编码
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
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
    case historyWarningActive.changeHandleRemoveStore:
      return state.merge(Immutable.fromJS(action.payload))
    case historyWarningActive.resetHistoryWarningStore:
      return initState
  }
  return state;
}
export default historyWarningReducer;