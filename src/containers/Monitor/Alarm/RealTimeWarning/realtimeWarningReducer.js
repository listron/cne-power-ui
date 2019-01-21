import Immutable from 'immutable';
import { realtimeWarningActive } from './realtimeWarningActive.js';

var initState = Immutable.fromJS({
  warningStatus:'1',//告警状态
  warningTypeStatus:'1',//实时告警
  stationType:'',
  warningType:'事件告警',//限值告警
  loading: false,
  orderField:'',
  orderCommand:'',
  durationType:null,
  warningLevel:[],//告警级别多个
  deviceTypeCode:[],//设备类型多个
  rangTime:[],//时间
  // startTime:'',//开始时间
  // endTime:'',//结束时间
  deviceName:null,//设备名称
  pageSize:10,
  currentPage:1,
  lastUpdateTime:'',//上次更新时间
  stationCodes:[],//电站编码
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