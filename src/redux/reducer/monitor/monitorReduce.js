import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitorReducer from './stationMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/singleStationReducer';
import alarmReducer from './alarmReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitorReducer, singleStation,alarmReducer });

export default monitorReducer;
