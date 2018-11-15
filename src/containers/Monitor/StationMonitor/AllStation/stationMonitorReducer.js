import Immutable from 'immutable';

import { allStationAction } from './allStationAction.js';

var initState = Immutable.fromJS({
   loading: false,
   allMonitorStation:{},//实时数据汇总
   windMonitorStation:{},
   pvMonitorStation:{},
   stationTypes: '2',//2-有风和光，默认显示全部，0-只有风，只显示风，1-只有光，只显示光
   stationTypeTabs:'2',
   stationShowType:'stationBlock',
});
const stationMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAction.MONITORSTATION_FETCH:
      return state.set('loading',true)
    case allStationAction.GET_MONITORSTATION_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case allStationAction.CHANGE_MONITORSTATION_STORE:
      return state.merge(Immutable.fromJS(action.payload))
   
  }
  return state;
}
export default stationMonitorReducer;
