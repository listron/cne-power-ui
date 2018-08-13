import { combineReducers } from '../../../../node_modules/_redux@3.7.2@redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitorReducer from './stationMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/SingleStationReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitorReducer, singleStation });

export default monitorReducer;
