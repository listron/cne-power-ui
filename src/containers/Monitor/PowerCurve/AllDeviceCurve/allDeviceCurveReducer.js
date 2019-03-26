import immutable from 'immutable';
import { allDeviceCurveAction } from './allDeviceCurveAction';
const initState = immutable.fromJS({
  stationTypeTabs:'0',//默认风
  deviceShowType:'graph',//默认展示图形
  stationCode:null,
  deviceTypeCode:101,
  deviceFullCode:[],
  selectdeviceCode:[],
  startTime:'',
  endTime:'',
  checkedAll:true,

  allDeviceCurveData:[],//多设备图表数据
  powerCurveListData:[],//table列表数据
  windDeviceMode: [], // 电站下风电机组可选设备型号
  pageSize:10,
  pageNum:1,
  total:0,
  orderField:'',//排序方式
  orderType:'0',//'0'是正序，'1'是倒序


});

const allDeviceCurveReducer = (state = initState, action) => {
  switch (action.type) {
    case allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case allDeviceCurveAction.changeAllDeviceStore:
      return state.merge(immutable.fromJS(action.payload));
    case allDeviceCurveAction.RESET_ALLDEVICECURVE:
      return initState;
  }
  return state;
}

export default allDeviceCurveReducer;
