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
import { reportManageRoute } from './routes/reportManageRoute';
import Cookie from 'js-cookie';

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
  ...reportManageRoute,
  ...statisticalRoute,
  ...highAnalysisRoute,
  ...systemRoute,
  { // 隐藏页： 修改账户
    path: '/hidden/user/accountSettings',
    component: lazy(() => import('../containers/Others/AccountSettings')),
  },
];


const theme = Cookie.get('theme');
export const routerConfig = routers.map((route, i) => (<Route
  key={route.path}
  path={route.path}
  exact={route.exact}
  render={props => (
    <Suspense fallback={
      <div className={`${styles.preComponent} ${styles[theme]}`}>
        <Spin size="large" tip="Loading..." />
      </div>}
    >
      <route.component {...props} />
    </Suspense>
  )}
/>));






