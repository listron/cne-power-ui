import { combineReducers } from 'redux'

import defect from './ticket/defect';
import inspect from './ticket/inspect';
import ticket from './ticket/ticket'

const operationReducer = (() => combineReducers({ defect, inspect, ticket }))();

export default operationReducer;