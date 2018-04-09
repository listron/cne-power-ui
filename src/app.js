'use strict';

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
// import router from './router';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware, logger];


const store = createStore(appReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

// const render = Component => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <Component />
//     </Provider>,
//     document.getElementById('app')
//   )
// };
// render(router);

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);