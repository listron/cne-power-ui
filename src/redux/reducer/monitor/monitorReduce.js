import { combineReducers } from 'redux';

import stationMonitor from './stationMonitor/stationMonitorReducer';
import deviceMonitor from './stationMonitor/deviceMonitorReducer';
import singleStation from './stationMonitor/singleStationReducer';
import alarm from '../../../containers/Monitor/Alarm/alarmReducer';
import alarmStatistic from '../../../containers/Monitor/Alarm/alarmStatisticReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitor, singleStation,alarm, alarmStatistic });

export default monitorReducer;
