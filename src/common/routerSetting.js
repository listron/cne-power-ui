import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Exception/404';
import Login from '../containers/Login';
import PreLogin from '../containers/PreLogin/PreLogin';
import Forget from '../containers/Forget';
import Signup from '../containers/Signup';
import Power from '../containers/Power';
import EnterpriseContainer from '../containers/System/EnterpriseContainer';

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
    path:'/newlogin',
    exact:true,
    component: PreLogin
  },
  {
    path:'/login',
    exact:true,
    component: Login
  }, {
    path:'/forget',
    exact:true,
    component: Forget
  }, {
    path:'/signup',
    exact:true,
    component: Signup
  },  {
    path:'/operation/ticket',
    exact:true,
    component: Ticket,
  },  {
    path:'/system/enterprise',
    exact:true,
    component: EnterpriseContainer,
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







