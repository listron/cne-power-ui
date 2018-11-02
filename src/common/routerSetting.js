import React from 'react';
import { Route } from 'react-router-dom';
// 运维管理-工单
import Ticket from '../containers/Operation/Ticket/Ticket';
import DefectDetail from '../containers/Operation/Ticket/Defect/DefectDetail/DefectDetail';

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
// 实时监控-电站监控
import AllStation from '../containers/Monitor/StationMonitor/AllStation/AllStation';
import DeviceMonitor from '../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor';
import SingleStation from '../containers/Monitor/StationMonitor/SingleStation/SingleStation';
// 实时监控-告警
import RealTimeAlarm from '../containers/Monitor/Alarm/RealTimeAlarm';
import HistoryAlarm from '../containers/Monitor/Alarm/HistoryAlarm';
import AlarmStatistic from '../containers/Monitor/Alarm/AlarmStatistic';

import EditPassword from '../containers/Others/EditPassword'; // 更改密码

import Building from '../components/Common/Building/Building';

//电站分析
import AllStationAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis';
import ProductionAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis';
import StationResourceAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis';
import OperateAnalysis from '../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis';
import StationContrast from '../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast';
import PerformanceAnalysis from "../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis";

import Power from '../containers/Power';

import Plan from "../containers/System/Production/Plan/Plan";
/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/
const routers = [
  {
    path: '/',
    exact: true,
    component: Building,
  },
  { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    exact: true,
    component: Ticket,
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    exact: true,
    component: Building,
  }, {
    path: '/operation/twoTickets/typeone',
    exact: true,
    component: Building,
  }, {
    path: '/operation/twoTickets/typetwo',
    exact: true,
    component: Building,
  }, {
    path: '/operation/book/sparePart',
    exact: true,
    component: Building,
  }, {
    path: '/operation/book/instrument',
    exact: true,
    component: Building,
  },{ // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    exact: true,
    component: DayReport,
  }, {
    path: '/operation/experience',
    exact: true,
    component: Building,
  }, {
    path: '/system/account/enterprise',
    exact: true,
    component: Enterprise,
  }, {
    path: '/system/account/department',
    exact: true,
    component: Department,
  }, {
    path: '/system/account/user',
    exact: true,
    component: User,
  }, {
    path: '/system/account/role',
    exact: true,
    component: Role,
  }, {
    path:'/system/account/user',
    exact:true,
    component: User,
  }, {
    path: '/monitor/alarm/realtime',
    exact: true,
    component: RealTimeAlarm,
  }, {
    path: '/monitor/alarm/transfer',
    exact: true,
    component: RealTimeAlarm,
  }, {
    path: '/monitor/alarm/transfer/:defectId',
    exact: true,
    component: DefectDetail,
  }, {
    path: '/monitor/alarm/relieve',
    exact: true,
    component: RealTimeAlarm,
  }, {
    path: '/monitor/alarm/history',
    exact: true,
    component: HistoryAlarm,
  }, {
    path: '/monitor/alarm/statistic',
    exact: true,
    component: AlarmStatistic,
  }, {
    path: '/monitor/alarm/statistic/:stationCode',
    exact: true,
    component: AlarmStatistic,
  },{
    path: '/monitor/station',
    exact: true,
    component: AllStation,
  }, {  // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    exact: true,
    component: DeviceMonitor
  }, {
    path: '/monitor/singleStation/:stationCode',
    exact: true,
    component: SingleStation,
  }, { // 隐藏页： 修改密码
    path: '/hidden/user/editPassword',
    exact: true,
    component: EditPassword
  },{ // 系统管理-电站管理-电站
    path: '/system/station/stationManage',
    exact: true,
    component: StationManage, // Building  StationManage
  },{ // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    exact: true,
    component: DeviceManage // Building  DeviceManage
  },{ // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    exact: true,
    component: PointManage  // Building  PointManage
  },{ // 系统管理-电站管理-测点
    path: '/system/station/alarmManage',
    exact: true,
    component: AlarmManage // Building  AlarmManage
  },{ // 系统管理-计划配置
    path: '/system/config/plan',
    exact: true,
    component:Plan
  },{
    path: '/statistical/stationaccount/allstation',
    exact: true,
    // component: AllStationAnalysis
    component: Building
  },{
    path: '/statistical/stationaccount/allstation/:stationCode',
    exact: true,
    // component: AllStationAnalysis
    component: Building
  },{
    path: '/statistical/stationaccount/production',
    exact: true,
    component: Building
    // component: ProductionAnalysis
  },{
    path: '/statistical/stationaccount/operate',
    exact: true,
    // component: OperateAnalysis
    component: Building
  },{
    path: '/statistical/stationaccount/resource',
    exact: true,
    // component: StationResourceAnalysis
    component: Building
  },{
    path: '/statistical/stationaccount/contrast',
    exact: true,
    // component: StationContrast
    component: Building
  },{
    path: '/statistical/equipment/performance',
    exact: true,
    component: Building
  },{
    path: '/statistical/equipment/manufacturers',
    exact: true,
    component: Building
  },{
    path: '/statistical/statement/daily',
    exact: true,
    component: Building
  },{
    path: '/statistical/statement/customization',
    exact: true,
    component: Building
  },{
    path: '/analysis/assess',
    exact: true,
    component: Building
  },{
    path: '/analysis/cleanout/dirt',
    exact: true,
    component: Building
  },{
    path: '/analysis/cleanout/record',
    exact: true,
    component: Building
  },{
    path: '/analysis/cleanout/configuration',
    exact: true,
    component: Building
  },
  {
    path: '/analysis/formation/abnormal',
    exact: true,
    component: Building
  },{
    path: '/analysis/formation/warning',
    exact: true,
    component: Building
  },{
    path: '/analysis/yaw/wind',
    exact: true,
    component: Building
  },{
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






