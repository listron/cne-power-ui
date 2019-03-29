'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk'; // thunk数据接收中间件， saga已用，不需，删除。
import createSagaMiddleware from 'redux-saga';
import Main from './containers/Main/Main';
import appReducer from './containers/indexReducer';
import rootSaga from './containers/indexSaga';
// import logger from 'redux-logger'; // redux action监听插件，console冗余，已删除。
import './theme/reset.scss';
import './theme/antdReset.scss';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const store = createStore(appReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <LocaleProvider locale={zhCN}>
        <Main />
      </LocaleProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);
