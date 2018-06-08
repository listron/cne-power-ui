import { combineReducers } from 'redux'

import defect from './ticket/defect';
import inspection from './ticket/inspection';

const operationReducer = (() => combineReducers({ defect, inspection }))();

export default operationReducer;