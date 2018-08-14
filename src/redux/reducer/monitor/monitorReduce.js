import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitorReducer from './stationMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/singleStationReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitorReducer, singleStation });

export default monitorReducer;
