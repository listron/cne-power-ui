import immutable from 'immutable';
import { singleDeviceCurveAction } from './singleDeviceCurveAction';
const initState = immutable.fromJS({
  stationCode: '',
  deviceFullCode: [],
  selectDeviceFullCode: [],
  time: '',
  deviceShowType: 'graph',
  deviceInfo: {},
  correct: 0,
  pageSize: 10,
  pageNum: 1,
  total: 0,
  orderField: '', //排序方式
  orderType: '0', //'0'是正序，'1'是倒序
  airDensity: '',
  curveTime: null,
  singleDeviceCurveData: [], //功率曲线图数据
  singleDeviceCurveList: [], //列表数据
  roseChartData: [], //玫瑰图数据
  powerspeedchartData: [], //转速图
  pitchanglespeedchartData: [], //桨距角图
  winddistributionchartData: [], //风频图
  sequencechartData: [], //时序图


});

const singleDeviceCurveReducer = (state = initState, action) => {
  switch (action.type) {
    case singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS:
      return state.merge(immutable.fromJS(action.payload));
    case singleDeviceCurveAction.changeSingleDeviceStore:
      return state.merge(immutable.fromJS(action.payload));
    case singleDeviceCurveAction.RESET_SINGLEDEVICECURVE:
      return initState;
  }
  return state;
};

export default singleDeviceCurveReducer;
