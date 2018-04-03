import React, { Component } from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import Power from './containers/Power';

const route = {
  path: '/',
  component: App,
  routes: [
    {
      path: '/home',
      component: Power,
    },
  ]
};

export const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={props => (
    <route.component {...props} routes={route.routes}/>
  )}/>
);

const router = () => {
  return <RouteWithSubRoutes {...route}/>;
};

export default router;