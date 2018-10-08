import { combineReducers } from 'redux';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';

const operationReducer = combineReducers({ defect, inspect, ticket });

export default operationReducer;
//ticket/defectReducer
//ticket/inspectReducer
//ticket/ticketReducer