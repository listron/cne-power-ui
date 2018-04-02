'use strict';

import './theme/style.scss';
import 'antd/dist/antd.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import App from './containers';
import appReducer from './redux/reducer';
import rootSaga from './redux/saga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware, logger];

const store = createStore(appReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);