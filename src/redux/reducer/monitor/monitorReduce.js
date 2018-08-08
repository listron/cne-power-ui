import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitorReducer from './stationMonitor/deviceMonitorReducer';


const monitorReducer = combineReducers({ stationMonitor,deviceMonitorReducer });

export default monitorReducer;
