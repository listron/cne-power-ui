import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';


const monitorReducer = combineReducers({ stationMonitor });

export default monitorReducer;
