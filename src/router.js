import React, { Component } from 'react';
import { Route } from 'react-router';
import Main from './containers/Main';
import Power from './containers/Power';

// const route = {
//   path: '/',
//   component: Main,
//   routes: [
//     {
//       path: '/home',
//       component: Power,
//     },
//   ]
// };

// export const RouteWithSubRoutes = (route) => (
//   <Route path={route.path} render={props => (
//     <route.component {...props} routes={route.routes}/>
//   )}/>
// );

// const router = () => {
//   return <RouteWithSubRoutes {...route}/>;
// };

// export default router;