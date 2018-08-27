import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitor from './stationMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/singleStationReducer';
import alarm from './alarmReducer';
import alarmStatistic from './alarmStatisticReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitor, singleStation,alarm, alarmStatistic });

export default monitorReducer;
