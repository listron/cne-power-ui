import { lazy } from 'react';

const stationMonitor = [
  { // 实时监控-电站监控-全部电站
    path: '/monitor/station',
    component: lazy(() => import('../../containers/Monitor/StationMonitor/AllStation/AllStation')),
  }, { // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    component: lazy(() => import('../../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor')),
  }, { // 实时监控-电站监控-单电站
    path: '/monitor/singleStation/:stationCode',
    component: lazy(() => import('../../containers/Monitor/StationMonitor/SingleStation/SingleStation')),
  },
];

const powerCurve = [
  {//实时监控-功率曲线-多设备
    path: '/monitor/data/powercurve',
    exact: true,
    component: lazy(() => import('../../containers/Monitor/PowerCurve/AllDeviceCurve/AllDeviceCurve')),
  }, {//实时监控-功率曲线-单设备
    path: '/monitor/powercurve/:stationCode/:deviceFullCode/:time',
    // path:'/hidden/monitor/powercurve/:stationCode/:deviceCode/:time',
    exact: true,
    component: lazy(() => import('../../containers/Monitor/PowerCurve/SingleDeviceCurve/SingleDeviceCurve')),
  },
];

const alarm = [
  { // 实时监控-告警-实时告警
    path: '/monitor/alarm/realtime',
    component: lazy(() => import('../../containers/Monitor/Alarm/RealTimeWarning/RealTimeWarning')),
  }, { // 实时监控-告警-已转工单
    path: '/monitor/alarm/transfer',
    component: lazy(() => import('../../containers/Monitor/Alarm/Transfer/TransferForm')),
  }, { // 实时监控-告警-手动解除
    path: '/monitor/alarm/relieve',
    component: lazy(() => import('../../containers/Monitor/Alarm/HandleRemove/HandleRemove')),
  }, { // 实时监控-告警-历史告警
    path: '/monitor/alarm/history',
    component: lazy(() => import('../../containers/Monitor/Alarm/HistoryWarning/HistoryWarning')),
  }, { // 实时监控-告警-单电站告警统计
    path: '/monitor/alarm/statistic/:stationCode',
    component: lazy(() => import('../../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic')),
  }, { // 实时监控-告警-告警统计
    path: '/monitor/alarm/statistic',
    component: lazy(() => import('../../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic')),
  },
];

// const report = [
//   { //实时监控-报表查询-电量报表
//     path: '/monitor/report/powerReport',
//     // component: lazy(() => import('../../components/Common/Building/Building')),
//     component: lazy(() => import('../../containers/Monitor/Report/PowerReport/PowerReport')),
//   }, { //实时监控-报表查询-设备状态
//     path: '/monitor/report/deviceStatus',
//     // component: lazy(() => import('../../components/Common/Building/Building')),
//     component: lazy(() => import('../../containers/Monitor/Report/DeviceStatus/DeviceStatus')),
//   }, { //实时监控-报表查询-故障报表
//     path: '/monitor/report/malfunction',
//     // component: lazy(() => import('../../components/Common/Building/Building')),
//     component: lazy(() => import('../../containers/Monitor/Report/Malfunction/Malfunction')),
//   }, { //实时监控-报表查询-损失电量
//     path: '/monitor/report/powerLost',
//     // component: lazy(() => import('../../components/Common/Building/Building')),
//     component: lazy(() => import('../../containers/Monitor/Report/PowerLost/PowerLost')),
//   },
// ];

const data = [
  { //实时监控-数据分析-历史趋势
    path: '/monitor/data/history',
    component: lazy(() => import('../../containers/Monitor/DataAnalysis/DataHistory/DataHistory')),
  }, { //实时监控-数据分析-散点图
    path: '/monitor/data/overview',
    component: lazy(() => import('@containers/Monitor/DataAnalysis/Overview/Overview')),
  }, { //实时监控-数据分析-数据概览
    path: '/monitor/data/scatterDiagram',
    component: lazy(() => import('../../containers/Monitor/DataAnalysis/DataScatterDiagram/DataScatterDiagram')),
  }, { //实时监控-数据分析-实时数据
    path: '/monitor/data/realtime',
    component: lazy(() => import('../../containers/Monitor/DataAnalysis/DataRealtime/DataRealtime')),
  }, { //实时监控-数据分析-数据导出
    path: '/monitor/dataExport',
    component: lazy(() => import('../../containers/Monitor/DataAnalysis/DataExport/DataExport')),
  },
];

const pvData = [
  { //实时监控-光伏数据分析-历史趋势
    path: '/monitor/pvData/history',
    component: lazy(() => import('../../containers/Monitor/PvDataAnalysis/PvDataHistory/PvDataHistory')),
  }, { //实时监控-光伏数据分析-实时数据
    path: '/monitor/pvData/realtime',
    component: lazy(() => import('../../containers/Monitor/PvDataAnalysis/PvDataRealtime/PvDataRealtime')),
  },
];

export const monitorRoute = [
  ...stationMonitor,
  ...powerCurve,
  ...data,
  //...report,
  ...alarm,
  { // 
    path: '/monitor/diagnoseCenter',
    component: lazy(() => import('../../containers/Monitor/DiagnoseCenter/DiagnoseCenter')),
  },
  ...pvData,
];

