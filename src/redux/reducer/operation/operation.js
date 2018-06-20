import { combineReducers } from 'redux'

import defect from './ticket/defect';
import inspect from './ticket/inspect';

const operationReducer = (() => combineReducers({ defect, inspect }))();

export default operationReducer;