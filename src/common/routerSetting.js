import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Login/Exception';
import Power from '../containers/Power';
import Enterprise from '../containers/System/Account/Enterprise/Enterprise';
import Department from '../containers/System/Account/Department/Department';
import User from '../containers/System/Account/User/User';
import AllStation from '../containers/Monitor/StationMonitor/AllStation/AllStation';
import DeviceMonitor from '../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor';
import Role from '../containers/System/Account/Role/Role';
import SingleStation from '../containers/Monitor/StationMonitor/SingleStation/SingleStation';
import RealTimeAlarm from '../containers/Monitor/Alarm/RealTimeAlarm';
import HistoryAlarm from '../containers/Monitor/Alarm/HistoryAlarm';
import AlarmStatistic from '../containers/Monitor/Alarm/AlarmStatistic';
import EditPassword from '../containers/Others/EditPassword';
import Building from '../components/Common/Building/Building';

import StationManage from '../containers/System/Station/StationManage/StationManage';
import DeviceManage from '../containers/System/Station/DeviceManage/DeviceManage';
import PointManage from '../containers/System/Station/PointManage/PointManage';
import AlarmManage from '../containers/System/Station/AlarmManage/AlarmManage';
/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/
const routers = [
  {
    path: '/',
    exact: true,
    component: Building
  }, 
  {
    path: '/404',
    exact: true,
    component: Exception
  },
  {
    path: '/operation/ticket/list',
    exact: true,
    component: Ticket,
  }, {
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
  },{
    path: '/operation/running',
    exact: true,
    component: Building,
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
    path: '/system/config',
    exact: true,
    component: Building
  },{
    path: '/statistical/stationaccount/allstation',
    exact: true,
    component: Building
  },{
    path: '/statistical/stationaccount/production',
    exact: true,
    component: Building
  },{
    path: '/statistical/stationaccount/operate',
    exact: true,
    component: Building
  },{
    path: '/statistical/stationaccount/resource',
    exact: true,
    component: Building
  },{
    path: '/statistical/stationaccount/contrast',
    exact: true,
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







