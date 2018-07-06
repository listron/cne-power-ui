import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Exception/404';
import Login from '../containers/Login';
import PreLoginContainer from '../containers/PreLogin/PreLoginContainer';
import Forget from '../containers/Forget';
import Signup from '../containers/Signup';
import Power from '../containers/Power';

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
    component: PreLoginContainer
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







