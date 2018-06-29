import React from 'react';
import { Route } from 'react-router-dom';
import Ticket from '../containers/Operation/Ticket/Ticket';
import Exception from '../containers/Exception/404';
import Login from '../containers/Login';
import Forget from '../containers/Forget';
import Signup from '../containers/Signup';
import Power from '../containers/Power';
import UserList from '../containers/Power/UserList';
import PostList from '../containers/Power/PostList';
import Pone from '../containers/TestPages/Pone';
import Ptwo from '../containers/TestPages/Ptwo';

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
  }, {
    path:'/page1',
    exact:true,
    component: UserList
  }, {
    path:'/page2',
    exact:true,
    component: PostList
  }, {
    path:'/pone',
    exact:true,
    component: Pone
  }, {
    path:'/ptwo',
    exact:true,
    component: Ptwo
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







