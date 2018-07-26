import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Login/Exception';
import Login from '../containers/Login/LoginLayout';
import Power from '../containers/Power';
import Enterprise from '../containers/System/Enterprise/Enterprise';
import Department from '../containers/System/Department/Department';
import User from '../containers/System/User/User';

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
  // {
  //   path:'/login',
  //   exact:true,
  //   component: Login
  // }, {
  //   path:'/forget',
  //   exact:true,
  //   component: Forget
  // }, {
  //   path:'/signup',
  //   exact:true,
  //   component: Signup
  // },  
  {
    path:'/operation/ticket',
    exact:true,
    component: Ticket,
  }, {
    path:'/system/enterprise',
    exact:true,
    component: Enterprise,
  }, {
    path:'/system/department',
    exact:true,
    component: Department,
  }, {
    path:'/system/user',
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







