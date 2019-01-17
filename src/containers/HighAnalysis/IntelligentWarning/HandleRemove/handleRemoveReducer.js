import Immutable from 'immutable';
import { handleRemoveActive } from './handleRemoveActive.js';

var initState = Immutable.fromJS({
  warningStatus:'2',//手动解除
  warningTypeStatus:'2',//手动解除
  warningType:'限值告警',//限值告警
  loading:false,
  deviceName:null,//设备名称
  pageSize:10,
  pageNum:1,
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
});
const handleRemoveReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case handleRemoveActive.changeHandleRemoveStore:
      return state.merge(Immutable.fromJS(action.payload))
    case handleRemoveActive.resetHandleRemoveStore:
      return initState
  }
  return state;
}
export default handleRemoveReducer;