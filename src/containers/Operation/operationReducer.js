import { combineReducers } from 'redux';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';
import personnelGps from './Ticket/PersonnelGps/personnelGpsReducer';

import dayReport from './Running/DayReport/dayReportReducer';
import workOrder from './Ticket/WorkOrder/workOrderReducer';

const operationReducer = combineReducers({ defect, inspect, ticket,personnelGps, dayReport,workOrder });

export default operationReducer;
