'use strict';

import "./theme/style.scss";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import Main from './containers/Main';
import appReducer from './redux/reducer';
import rootSaga from './redux/sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware, logger];


const store = createStore(appReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);


ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);