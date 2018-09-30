import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/AllStation/stationMonitorReducer';
import deviceMonitor from './stationMonitor/DeviceMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/SingleStation/singleStationReducer';
import alarm from './Alarm/alarmReducer';
import alarmStatistic from './Alarm/alarmStatisticReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitor, singleStation,alarm, alarmStatistic });

export default monitorReducer;
