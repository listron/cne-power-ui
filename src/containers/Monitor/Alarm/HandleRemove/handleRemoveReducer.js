import Immutable from 'immutable';
import { handleRemoveAction } from './handleRemoveAction.js';

var initState = Immutable.fromJS({
  warningStatus:'2',//手动解除
  warningTypeStatus:'2',//手动解除
  warningType:'事件告警',//事件告警
  stationType:'1',
  loading:false,
  deviceName:null,//设备名称
  pageSize:10,
  pageNum:1,
  total:0,
  rangTime:[],//时间
  startTime:[],//开始时间
  endTime:[],//结束时间
  stationCodes:[],//电站编码
  warningLevel:[],//告警级别多个
  deviceTypeCode:[],//设备类型多个
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
  handleRemoveList:[],//手动解除告警列表
  selectedRowKeys: [], //表格选中的行key
  defectTypes:[],
  defectId: '',
  relieveInfo:{},//手动解除的处理详情
});
const handleRemoveReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case handleRemoveAction.changeHandleRemoveStore:
      return state.merge(Immutable.fromJS(action.payload))
    case handleRemoveAction.resetHandleRemoveStore:
      return initState
  }
  return state;
}
export default handleRemoveReducer;