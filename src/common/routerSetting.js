import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Login/Exception';
import Login from '../containers/Login/LoginLayout';
import Power from '../containers/Power';
import Enterprise from '../containers/System/Account/Enterprise/Enterprise';
import Department from '../containers/System/Account/Department/Department';
import User from '../containers/System/Account/User/User';
import AllStation from '../containers/Monitor/StationMonitor/AllStation/AllStation';
import DeviceMonitor from '../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor';
import Role from '../containers/System/Account/Role/Role';
import SingleStation from '../containers/Monitor/StationMonitor/SingleStation/SingleStation';
/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/
const routers = [
  {
    path: '/',
    exact: true,
    component: Power
  }, {
    path: '/404',
    exact: true,
    component: Exception
  },
  {
    path: '/login',
    exact: true,
    component: Login
  },
  {
    path: '/operation/ticket',
    exact: true,
    component: Ticket,
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
    path: '/monitor/station',
    exact: true,
    component: AllStation,
  }, {  // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    exact: true,
    component: DeviceMonitor
  }, {  // 菜单栏中不展示的--单电站实时数据
    path: '/hidden/singleStation/:stationCode',
    exact: true,
    component: SingleStation,
  }, {  // 菜单栏中不展示的--
    path: '/hidden/singleStation/:stationCode/:intervalTime',
    exact: true,
    component: SingleStation,
  }
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







