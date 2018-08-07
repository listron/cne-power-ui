'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {HashRouter} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import Main from './containers/Main/Main';
import appReducer from './redux/reducer';
import rootSaga from './redux/sagas';
import './theme/reset.scss';
import './theme/antdReset.scss';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware];
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
