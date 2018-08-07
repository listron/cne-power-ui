import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Login/Exception';
import Login from '../containers/Login/LoginLayout';
import Power from '../containers/Power';
import Enterprise from '../containers/System/Account/Enterprise/Enterprise';
import Department from '../containers/System/Account/Department/Department';
import User from '../containers/System/Account/User/User';
import Role from '../containers/System/Account/Role/Role';


const routers = [
  {
    path:'/',
    exact:true,
    component: Power
  },{
    path:'/404',
    exact:true,
    component: Exception
  },
  {
    path:'/login',
    exact:true,
    component: Login
  },
  {
    path:'/operation/ticket',
    exact:true,
    component: Ticket,
  }, {
    path:'/system/account/enterprise',
    exact:true,
    component: Enterprise,
  }, {
    path:'/system/account/department',
    exact:true,
    component: Department,
  }, {
    path:'/system/account/role',
    exact:true,
    component: Role,
  }, {
    path:'/system/account/user',
    exact:true,
    component: User,
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







