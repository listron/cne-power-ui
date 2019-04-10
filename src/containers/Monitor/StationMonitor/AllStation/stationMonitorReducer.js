import Immutable from 'immutable';

import { allStationAction } from './allStationAction.js';

var initState = Immutable.fromJS({
   loading: false,
   allMonitorStation:{},//实时数据汇总
   windMonitorStation:{},
   pvMonitorStation:{},
   stationType: '0', // 2-有风和光，默认显示全部，0-只有风，只显示风，1-只有光，只显示光
   stationShowType:'stationBlock',
   capabilityData:[],// 出力图
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
