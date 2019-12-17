import { combineReducers } from 'redux';

import stationMonitor from './StationMonitor/AllStation/stationMonitorReducer';
import { deviceMonitor } from './StationMonitor/DeviceMonitor/deviceMonitorReducer';
import singleStation from './StationMonitor/SingleStation/singleStationReducer';

import allDeviceCurveReducer from './PowerCurve/AllDeviceCurve/allDeviceCurveReducer';
import singleDeviceCurveReducer from './PowerCurve/SingleDeviceCurve/singleDeviceCurveReducer';


import realtimeWarningReducer from './Alarm/RealTimeWarning/realtimeWarningReducer';
import transferFormReducer from './Alarm/Transfer/transferFormReducer';
import handleRemoveReducer from './Alarm/HandleRemove/handleRemoveReducer';
import historyWarningReducer from './Alarm/HistoryWarning/historyWarningReducer';
import powerReportReducer from './Report/PowerReport/powerReportReducer';
import deviceStatusReducer from './Report/DeviceStatus/deviceStatusReducer';
import malfunctionReducer from './Report/Malfunction/malfunctionReducer';
import powerLostReducer from './Report/PowerLost/powerLostReducer';
import alarmStatistic from './Alarm/AlarmStatic/alarmStatisticReducer';
import alarmCount from './Alarm/AlarmCount/alarmCountReducer';

import { overview } from './DataAnalysis/Overview/overviewReducer'; // 数据分析 - 数据概览
import { dataHistory } from './DataAnalysis/DataHistory/historyReducer'; // 数据分析 - 历史趋势
import { dataRealtime } from './DataAnalysis/DataRealtime/realtimeReducer'; // 数据分析 - 实时数据
import { dataScatterDiagram } from './DataAnalysis/DataScatterDiagram/scatterDiagramReducer'; // 数据分析 - 散点图
import dataExport from './DataAnalysis/DataExport/dataExportReducer'; // 数据分析 - 数据导出

import { pvDataHistory } from './PvDataAnalysis/PvDataHistory/pvHistoryReducer'; // 光伏数据分析 - 历史趋势
import { pvDataRealtime } from './PvDataAnalysis/PvDataRealtime/pvRealtimeReducer'; // 光伏数据分析 - 实时数据

const monitorReducer = combineReducers({
  stationMonitor,
  deviceMonitor,
  singleStation,
  realtimeWarningReducer,
  transferFormReducer,
  alarmStatistic,
  handleRemoveReducer,
  historyWarningReducer,
  allDeviceCurveReducer,
  singleDeviceCurveReducer,
  powerReportReducer,
  deviceStatusReducer,
  malfunctionReducer,
  powerLostReducer,
  overview,
  dataHistory,
  dataRealtime,
  dataScatterDiagram,
  alarmCount,
  dataExport,
  pvDataHistory,
  pvDataRealtime,
});

export default monitorReducer;
