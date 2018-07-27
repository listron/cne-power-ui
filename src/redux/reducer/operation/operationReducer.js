import { combineReducers } from 'redux';

import defect from './ticket/defectReducer';
import inspect from './ticket/inspectReducer';
import ticket from './ticket/ticketReducer';

const operationReducer = combineReducers({ defect, inspect, ticket });

export default operationReducer;