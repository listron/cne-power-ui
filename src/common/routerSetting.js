import React from 'react';
import { Route } from 'react-router-dom';
// 主页
import Homepage from '../containers/Home/Homepage';
// 运维管理-工单
import Ticket from '../containers/Operation/Ticket/Ticket';
import PersonnelGps from '../containers/Operation/PersonnelGps/PersonnelGps';

import DayReport from '../containers/Operation/Running/DayReport/DayReport'; // 日报

//系统管理-用户管理
import Enterprise from '../containers/System/Account/Enterprise/Enterprise';
import Department from '../containers/System/Account/Department/Department';
import User from '../containers/System/Account/User/User';
import Role from '../containers/System/Account/Role/Role';
// 系统管理-电站管理
import StationManage from '../containers/System/Station/StationManage/StationManage';
import DeviceManage from '../containers/System/Station/DeviceManage/DeviceManage';
import PointManage from '../containers/System/Station/PointManage/PointManage';
import AlarmManage from '../containers/System/Station/AlarmManage/AlarmManage';
import PowerCurve from '../containers/System/Station/PowerCurve/PowerCurve';
// 系统管理-生产计划
import Plan from "../containers/System/Production/Plan/Plan";
//系统管理-计划配置
import Warning from "../containers/System/Production/Warning/Warning";
// 实时监控-电站监控
import AllStation from '../containers/Monitor/StationMonitor/AllStation/AllStation';
import DeviceMonitor from '../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor';
import SingleStation from '../containers/Monitor/StationMonitor/SingleStation/SingleStation';
// 实时监控-告警
import RealTimeAlarm from '../containers/Monitor/Alarm/RealTimeAlarm';
import HistoryAlarm from '../containers/Monitor/Alarm/HistoryAlarm';
import AlarmStatistic from '../containers/Monitor/Alarm/AlarmStatistic';
import TransferAlarm from '../containers/Monitor/Alarm/TransferAlarm';

import EditPassword from '../containers/Others/EditPassword'; // 更改密码
import Building from '../components/Common/Building/Building';

//电站分析
import AllStationAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis';
import ProductionAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis';
import StationResourceAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis';
import OperateAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis';
import StationContrast from '../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast';
import PerformanceAnalysis from "../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis";

//统计报表
import GeneralReport from '../containers/StatisticalAnalysis/StatisticalReport/GeneralReport/GeneralReport';
//高级分析 实时告警，已转工单，手动接触，历史告警
import RealTimeWarning from '../containers/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarning';
import TransferForm from '../containers/HighAnalysis/IntelligentWarning/Transfer/TransferForm';
import HandleRemove from '../containers/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemove';
import HistoryWarning from '../containers/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarning';

//高级分析 清洗预警 清洗记录
import CleanWarning from '../containers/HighAnalysis/CleanoutModel/CleanWarning/CleanWarning';
import CleanoutRecord from '../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord';
// import CleanoutRecordDetail from '../components/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordSingleStation/CleanoutRecordDetail';
// 高级分析 低效组串预警
import Unhandle from '../containers/HighAnalysis/EarlyWarning/Unhandle/Unhandle';
import Ignore from '../containers/HighAnalysis/EarlyWarning/Ignore/Ignore';
import Transfer from '../containers/HighAnalysis/EarlyWarning/Transfer/Transfer';
import HistoryWarn from '../containers/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarn';



/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/
const routers = [
  {
    path: '/homepage',
    exact: true,
    component: Homepage,
  },{ // 运维管理-工单-员工定位
    path: '/operation/gps',
    exact: true,
    //component: Building,
    component: PersonnelGps,
  },
  { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    exact: true,
    component: Ticket,
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    exact: true,
    component: Building,
  },  {//两票管理>第一种工作票
    path: '/operation/twoTickets/typeone',
    exact: true,
    component: Building,
  }, {//第二种工作票
    path: '/operation/twoTickets/typetwo',
    exact: true,
    component: Building,
  }, {//备品备件
    path: '/operation/book/sparePart',
    exact: true,
    component: Building,
  }, {//工器具
    path: '/operation/book/instrument',
    exact: true,
    component: Building,
  }, { // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    exact: true,
    component: DayReport,
  }, { // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    exact: true,
    component: Building,
  }, {
    path: '/operation/experience',
    exact: true,
    component: Building,
  }, {  // 系统管理-账户管理-企业
    path: '/system/account/enterprise',
    exact: true,
    component: Enterprise,
  }, { // 系统管理-账户管理-部门
    path: '/system/account/department',
    exact: true,
    component: Department,
  }, { // 系统管理-账户管理-用户
    path: '/system/account/user',
    exact: true,
    component: User,
  }, { // 系统管理-账户管理-角色
    path: '/system/account/role',
    exact: true,
    component: Role,
  }, { //实时监控-告警-实施告警
    path: '/monitor/alarm/realtime',
    exact: true,
    component: RealTimeAlarm,
  }, { //实时监控-告警-已转工单
    path: '/monitor/alarm/transfer',
    exact: true,
    component: TransferAlarm,
  }, { //实时监控-告警-手动解除
    path: '/monitor/alarm/relieve',
    exact: true,
    component: RealTimeAlarm,
  }, { //实时监控-告警-历史告警
    path: '/monitor/alarm/history',
    exact: true,
    component: HistoryAlarm,
  }, { //实时监控-告警-告警统计
    path: '/monitor/alarm/statistic',
    exact: true,
    component: AlarmStatistic,
  }, {//告警统计单电站
    path: '/monitor/alarm/statistic/:stationCode',
    exact: true,
    component: AlarmStatistic,
  }, {  //实时监控-电站监控-全部电站
    path: '/monitor/station',
    exact: true,
    component: AllStation,
  }, {  // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    exact: true,
    component: DeviceMonitor
  }, { //实时监控-电站监控-单电站
    path: '/monitor/singleStation/:stationCode',
    exact: true,
    component: SingleStation,
  }, { // 隐藏页： 修改密码
    path: '/hidden/user/editPassword',
    exact: true,
    component: EditPassword
  }, { // 系统管理-电站管理-电站
    path: '/system/station/stationManage',
    exact: true,
    component: StationManage, // Building  StationManage
  }, { // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    exact: true,
    component: DeviceManage // Building  DeviceManage
  }, { // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    exact: true,
    component: PointManage  // Building  PointManage
  }, { // 系统管理-电站管理-告警事件
    path: '/system/station/alarmManage',
    exact: true,
    component: AlarmManage // Building  AlarmManage
  }, { // 系统管理-电站管理-功率曲线
    path: '/system/station/powerCurve',
    exact: true,
    component: PowerCurve // Building  AlarmManage
  }, { // 系统管理-计划配置
    path: '/system/config/plan',
    exact: true,
    component: Plan
  }, { // 系统管理-预警配置
    path: '/system/config/warning',
    exact: true,
    component: Warning
  }, { // 统计分析-电站分析-全部电站
    path: '/statistical/stationaccount/allstation',
    exact: true,
    component: AllStationAnalysis
  }, { // 统计分析-电站分析-全部电站-单电站
    path: '/statistical/stationaccount/allstation/:stationCode',
    exact: true,
    component: AllStationAnalysis
  }, { // 统计分析-电站分析-生产分析
    path: '/statistical/stationaccount/production',
    exact: true,
    component: ProductionAnalysis
  }, { // 统计分析-电站分析-运行分析
    path: '/statistical/stationaccount/operate',
    exact: true,
    component: OperateAnalysis
  }, { // 统计分析-电站分析-资源分析
    path: '/statistical/stationaccount/resource',
    exact: true,
    component: StationResourceAnalysis
  }, { // 统计分析-电站分析-电站对比
    path: '/statistical/stationaccount/contrast',
    exact: true,
    component: StationContrast
  }, { //  统计分析-设备分析-设备性能分析
    path: '/statistical/equipment/performance',
    exact: true,
    component: PerformanceAnalysis
    // component: Building,
  }, {//厂家对比
    path: '/statistical/equipment/manufacturers',
    exact: true,
    component: Building
  }, {//统计报表
    path: '/statistical/statement/currency',
    exact: true,
    component: GeneralReport,
  },
  // { // 高级分析/ 光伏发电评估
  //   path: '/analysis/assess',
  //   exact: true,
  //   component: Building
  // },
  {
    path: '/analysis/intelligentWarning/realtime',
    exact: true,
      //  component: Building
    component: RealTimeWarning
  },
  {
    path: '/analysis/intelligentWarning/transfer',
    exact: true,
    component: TransferForm
    //  component: Building
  },
  {
    path: '/analysis/intelligentWarning/handleremove',
    exact: true,
    // component: HandleRemove
     component: Building
  },
  {
    path: '/analysis/intelligentWarning/historywarning',
    exact: true,
    // component: HistoryWarning
     component: Building
  },
  // }, 
  { // 高级分析>清洗模型>清洗预警
    path: '/analysis/cleanout/warning',
    exact: true,
    component: CleanWarning, // Building
  }, { // 高级分析>清洗模型>清洗计划与记录
    path: '/analysis/cleanout/record',
    exact: true,
    // component: CleanoutRecordMain,
    component: CleanoutRecord,
    // component: Building
  }, {//单电站清洗计划与记录详情
    path: '/analysis/cleanout/record/:stationCode',
    exact: true,
    component: CleanoutRecord
    // component: Building
  },
  { // 组串异常分析
    path: '/analysis/formation/abnormal',
    exact: true,
    component: Building
  }, {  // 高级分析-低效组串预警-待处理预警
    path: '/analysis/earlyWarning/unhandle',
    exact: true,
    // component: Building,
    component: Unhandle
  }, { // 高级分析-低效组串预警-已忽略
    path: '/analysis/earlyWarning/ignore',
    exact: true,
    // component: Building,
    component: Ignore
  },
  { // 高级分析-低效组串预警-已转工单
    path: '/analysis/earlyWarning/transfer',
    exact: true,
    // component: Building,
    component: Transfer
  }, {  // 高级分析-低效组串预警-历史预警
    path: '/analysis/earlyWarning/history',
    exact: true,
    component: HistoryWarn
  },
  {//偏航对风分析
    path: '/analysis/yaw/wind',
    exact: true,
    component: Building
  }, {//预警事件配置
    path: '/analysis/yaw/config',
    exact: true,
    component: Building
  },
];

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    exact={route.exact}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);
export const routerConfig = routers.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);






