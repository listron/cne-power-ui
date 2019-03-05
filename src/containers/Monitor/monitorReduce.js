import { combineReducers } from 'redux';

import stationMonitor from './StationMonitor/AllStation/stationMonitorReducer';
import deviceMonitor from './StationMonitor/DeviceMonitor/deviceMonitorReducer';
import singleStation from './StationMonitor/SingleStation/singleStationReducer';

import allDeviceCurveReducer from './PowerCurve/AllDeviceCurve/allDeviceCurveReducer';
import singleDeviceCurveReducer from './PowerCurve/SingleDeviceCurve/singleDeviceCurveReducer';


import realtimeWarningReducer from './Alarm/RealTimeWarning/realtimeWarningReducer';
import transferFormReducer from './Alarm/Transfer/transferFormReducer';
import handleRemoveReducer from './Alarm/HandleRemove/handleRemoveReducer';
import historyWarningReducer from './Alarm/HistoryWarning/historyWarningReducer';
import alarm from './Alarm/alarmReducer';
import alarmStatistic from './Alarm/alarmStatisticReducer';

import { dataHistory } from './DataAnalysis/DataHistory/historyReducer'; // 数据分析 - 历史趋势
import { dataRealtime } from './DataAnalysis/DataRealtime/realtimeReducer'; // 数据分析 - 实时数据

const monitorReducer = combineReducers({
  stationMonitor,
  deviceMonitor,
  singleStation,
  alarm,
  realtimeWarningReducer,
  transferFormReducer,
  alarmStatistic,
  handleRemoveReducer,
  historyWarningReducer, 
  allDeviceCurveReducer,
  singleDeviceCurveReducer,
  dataHistory,
  dataRealtime,
});

export default monitorReducer;
