import Immutable from 'immutable';
import { realtimeWarningActive } from './realtimeWarningActive.js';

var initState = Immutable.fromJS({
  warningTypeStatus:'1',//实时告警
  warningType:'限值告警',//限值告警
  loading:'false',
  pageSize:10,
  currentPage:1,
  lastUpdateTime:'',
  stationCode:[],//电站编码
  warningLevel:[],//告警级别多个
  deviceTypeCode:[],//设备类型多个
  startTime:'',//开始时间
  endTime:'',//结束时间
  deviceName:'',//设备名称
  isTransferWork: 1,
  isRelieveAlarm: 1,
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
  realtimeWarning:[],//实时预警的列表
  selectedRowKeys: [], //表格选中的行key
  defectTypes:[],
  defectId: '',
});
const realtimeWarningReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case realtimeWarningActive.changeRealtimeWarningStore:
      return state.merge(Immutable.fromJS(action.payload))
    case realtimeWarningActive.resetRealtimeWarninStore:
      return initState
  }
  return state;
}
export default realtimeWarningReducer;