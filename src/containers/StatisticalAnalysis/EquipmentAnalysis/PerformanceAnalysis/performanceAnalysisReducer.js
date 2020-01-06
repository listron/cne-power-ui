import Immutable from 'immutable';
import { performanceAnalysisAction } from './performanceAnalysisAction';

const initState = Immutable.fromJS({
  loading: false,
  timeType: 'last30',
  contrastSwitch: false, //对比按钮
  stationCode: null, //电站
  deviceTypeCode: '201,206', //初始的逆变器的型号
  deviceModeTypeCode: null, //选中的设备型号
  deviceModeCode: null, //控制设备型号的显示
  electricLineCode: null,
  deviceModels: [], //设备型号数据
  deviceTypes: [], //设备类型数据
  deviceModelOther: [], //逆变器201
  startDate: '', //时间选择的开始时间
  endDate: '', //时间选择的结束时间
  contrastStartDate: '', //对比开始的时间
  contrastEndDate: '', //对比结束的时间
  targetTabs: '1', //tab发电性能
  efficialList: [], //
  eleLineCodeData: [], //集电线路的数据
  //tab表中的数据
  conversionAvgRate: '',
  conversioneffData: [],
  hourData: [],
  availabilityData: [],
  lostPowerData: [],
  faultNumData: [],
  faultTimeData: [],
  //下面是对比的数据
  contrastAvgRate: '',
  contrastConversionAvgRate: '',
  conversioneffContrastData: [],
  hourContrastData: [],
  availabilityContrastData: [],
  lostPowerContrastData: [],
  faultNumContrastData: [],
  faultTimeContrastData: [],
  conversDeviceNames: [], //前五设备名
  hourDeviceNames: [], //前五设备名
  availabilityDeviceNames: [], //前五设备名
  lostPowerDeviceNames: [], //前五设备名
  faultNumDeviceNames: [], //前五设备名
  faultTimeDeviceNames: [], //前五设备名
  conversionNullValue: [], //
  eleDeviceModels: [], //集电线路下的设备型号类型
  conConversNullValue: [],
  conHourNullValue: [],
  conFaultNumNullValue: [],
  conFaultTimeNullValue: [],
  hourNullValue: [],
  faultNumNullvalue: [],
  faultTimeNullValue: [],



});

const performanceAnalysisReducer = (state = initState, action) => {
  switch (action.type) {
    case performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH:
      return state.set('loading', true);
    case performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case performanceAnalysisAction.CHANGE_PERFORMANCEANALYSIS_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case performanceAnalysisAction.resetStore:
      return initState;

  }
  return state;
};


export default performanceAnalysisReducer;
