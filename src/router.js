import React, { Component } from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import Asset from './containers/Asset';

const route = {
  path: '/',
  component: App,
  routes: [
    {
      path: '/home',
      component: Asset,
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