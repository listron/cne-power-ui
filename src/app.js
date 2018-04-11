'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory,hashHistory ,HashRouter,Redirect, Switch, Route} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import Main from './containers/Main';
import appReducer from './redux/reducer';
import rootSaga from './redux/sagas';
import {getCookie} from './utils';
import Login from './containers/Login';
// import router from './router';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware, logger];


const store = createStore(appReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);


ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
    <Main />
  </HashRouter>
  </Provider>,
  document.getElementById('app')
);