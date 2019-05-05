import { combineReducers } from 'redux';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';
import personnelGps from './PersonnelGps/personnelGpsReducer';

import dayReport from './Running/DayReport/dayReportReducer';
import workOrder from './Ticket/WorkOrder/workOrderReducer';

import intelligentExpert from './IntelligentExpert/intelligentExpertReducer';

const operationReducer = combineReducers({ defect, inspect, ticket,personnelGps, dayReport,workOrder, intelligentExpert });

export default operationReducer;
