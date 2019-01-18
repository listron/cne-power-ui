import { combineReducers } from 'redux';

import stationMonitor from './StationMonitor/AllStation/stationMonitorReducer';
import deviceMonitor from './StationMonitor/DeviceMonitor/deviceMonitorReducer';
import singleStation from './StationMonitor/SingleStation/singleStationReducer';
import realTimeAlarmReducer from './Alarm/RealTimeAlarm/realTimeAlarmReducer';
import transferAlarmReducer from './Alarm/TransferAlarm/transferAlarmReducer';
import handleRemoveAlarmReducer from './Alarm/HandleRemoveAlarm/handleRemoveAlarmReducer';
import historyAlarmReducer from './Alarm/HistoryAlarm/historyAlarmReducer';
import alarm from './Alarm/alarmReducer';
import alarmStatistic from './Alarm/alarmStatisticReducer';

const monitorReducer = combineReducers({ stationMonitor,deviceMonitor, singleStation,alarm, alarmStatistic,realTimeAlarmReducer,transferAlarmReducer,handleRemoveAlarmReducer,historyAlarmReducer });

export default monitorReducer;
