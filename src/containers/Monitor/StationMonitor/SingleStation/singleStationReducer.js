import Immutable from 'immutable';
import { singleStationAction } from './singleStationAction';

var initState = Immutable.fromJS({
  loading: false,//加载状态
  singleStationData: {},//单电站数据
  stationType: '',//电站类型  0：风 1：光
  capabilityData: [],//出力图数据
  capabilityDataTime: null,// 出力图的时间
  capabilityLoading: false,
  powerData: [],//理论发电量 实际发电量数据
  powerTime: null,//发电量时间
  windPowerData:[],
  windPowerTime:null,
  powerDataLoading: false,
  operatorList: [],//企业运维人员列表
  operatorTime: null,// 企业运维人员列表时间
  weatherList: [],//天气列表
  alarmList: {},//告警数统计
  workList: {},//工单数统计
  deviceTypeFlow: {},//设备类型示意图
  deviceTypeCode: '1',//当前显示设备列表code值 默认显示逆变器
  pvmoduleList: [],//光伏组件列表
  pvAvgValue: '', //光伏组件列表 正常电流
  pvLevelNums: {},//光伏组件 电流等级
  inverterList: {},//逆变器列表
  confluenceBoxList: {}, // 汇流箱列表详细信息。
  boxTransformerList: {},//箱变列表
  collectorList: [], // 集电线路信息列表
  boosterList: [], // 升压站列表数据
  powerNetList: [], // 电网信息列表
  error: {},//请求错误返回信息
  stationDeviceList: [],//单电站设备列表
  fanList: {}, //风机列表
  singleStationScatter: {},// 等效小时散点图
  singleStationScattertime: null,// 等效小时散点图时间
  pointparams: {},//单电站测点参数(风机)
  fanDisplay: 'deviceCard', // 单电站风机展示形式  deviceCard deviceTable deviceMap
  windCapabilityData: [],
  windCapabilityDataTime: null,
  monthPlanPower: {
    monthPlanPowerData: [],
    monthPlanPowerTime: null,
    monthPlanPowerLoading: false,
  },
  weatherstationDetail: {},// 天气的详细情况
  deviceAlarmList: [],//气象站告警
  radiationchartData: [], // 气象站的图表数据
  radiationchartTime: null, // 气象站的图表数据时间
  sketchmapData:{},//流程图数据
});

const singleStationReducer = (state = initState, action) => {
  switch (action.type) {
    case singleStationAction.singleStationFetch:
      return state.set('loading', true);
    case singleStationAction.getSingleStationSuccess:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case singleStationAction.changeSingleStationStore:
      return state.merge(Immutable.fromJS(action.payload));
    case singleStationAction.resetStore:
      return initState;
  }
  return state;
}


export default singleStationReducer;
