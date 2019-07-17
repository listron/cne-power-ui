import Immutable from 'immutable';

import { allStationAction } from './allStationAction.js';

var initState = Immutable.fromJS({
  loading: false,
  allMonitorStation: {},//实时数据汇总
  windMonitorStation: {},
  pvMonitorStation: {},
  stationType: '2', // 2-有风和光，默认显示全部，0-只有风，只显示风，1-只有光，只显示光
  stationShowType: 'stationBlock',
  capabilityData: [],// 出力图
  powerData: [], // 发电量图
  scatterData: {},// 等效小时
  scatterTime: null,// 等效小时时间
  capabilityDataTime: null,//出力图时间
  powerTime: null,//发电量时间
  powerLoading: false, //发电量 loading
  capabilityLoading: false,// 出力图的loading
  regionName: '全部区域', // 区域名称
  pvCapabilitydiagramsData: [],// 光伏电站的图表数据
  monthPlanPowerLoading: false, //多电站月累计与计划发电量图
  monthPlanPowerTime: null, // 多电站月累计与计划发电量图
  monthPlanPowerData: [],// 多电站月累计与计划发电量图
  dayPowerData: [], // 多电站日发电量与等效时图
  dayPowerTime: null, // 多电站日发电量与等效时图
  dayPowerLoading: false, // 多电站日发电量与等效时图
  monthPowerData: [], // 多电站月发电量与等效时图
  monthPowerTime: null, // 多电站月发电量与等效时图
  monthPowerLoading: false, // 多电站月发电量与等效时图
  pvUnix: null,
  stationCodes: [], //请求出力图的codes
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
