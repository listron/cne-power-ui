import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
// import Loadable from 'react-loadable';
import styles from './loading.scss';
import { Spin } from 'antd';
import { monitorRoute } from './routes/monitorRoute';
import { operationRoute } from './routes/operationRoute';
import { statisticalRoute } from './routes/statisticalRoute';
import { systemRoute } from './routes/systemRoute';
import { highAnalysisRoute } from './routes/highAnalysisRoute';

/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/

const routers = [
  { // 主页
    path: '/homepage',
    component: lazy(() => import('../containers/Home/Homepage')),
  },
  ...monitorRoute,
  ...operationRoute,
  ...statisticalRoute,
  ...highAnalysisRoute,
  ...systemRoute,
  { // 隐藏页： 修改账户
    path: '/hidden/user/accountSettings',
    component: lazy(() => import('../containers/Others/AccountSettings')),
  },
];

// const Loading = ({ pastDelay, timedOut, error }) => {
//   if (pastDelay) {
//     return (<div className={styles.preComponent}>
//      <Spin size="large" tip="Loading..." />
//   </div>);
//   } else if (timedOut) {
//     return <div>Taking a long time...</div>;
//   } else if (error) {
//     return <div className={styles.preComponent}>Error! 请重新刷新页面</div>;
//   }
//   return null;
// };

// const RouteWithSubRoutes = ({ component, routes, path, exact = true}) => {
//   const Component = Loadable({
//     loader: component,
//     loading: Loading,
//     timeout: 10000
//   });
//   return (
//     <Route
//       path={path}
//       exact={exact}
//       render={props => (
//         <Component {...props} routes={routes} />
//       )}
//     />
//   )
// };

export const routerConfig = routers.map((route, i) => (<Route
  key={route.path}
  path={route.path}
  exact={route.exact}
  render={props => (
    <Suspense fallback={
      <div className={styles.preComponent}>
          <Spin size="large" tip="Loading..." />
      </div>}
    >
      <route.component {...props} />
    </Suspense>
  )}
/>));






