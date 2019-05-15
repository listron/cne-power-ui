import Immutable from 'immutable';

import { allStationAction } from './allStationAction.js';

var initState = Immutable.fromJS({
  loading: false,
  allMonitorStation: {},//实时数据汇总
  windMonitorStation: {},
  pvMonitorStation: {},
  stationType: '2', // 2-有风和光，默认显示全部，0-只有风，只显示风，1-只有光，只显示光
  stationShowType: 'stationBlock',  // 只用于风电的控制
  capabilityData: [],// 出力图
  powerData: [], // 发电量图
  scatterData: {},// 等效小时
  scatterTime: null,// 等效小时时间
  capabilityDataTime: null,//出力图时间
  powerTime: null,//发电量时间
  capabilityLoading:false,// 出力图的loading
  dayPowerData: [], 
  dayPowerTime: null,
  monthPowerData: [],
  monthPowerTime: null,
  monthPlanPowerData: [],
  monthPlanPowerTime: null,
});

const stationMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAction.changeMonitorstationStore:
      return state.merge(Immutable.fromJS(action.payload))
    case allStationAction.resetMonitorData:
      return initState;
  }
  return state;
}
export default stationMonitorReducer;

