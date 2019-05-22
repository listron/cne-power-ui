import { combineReducers } from 'redux';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';
import personnelGps from './PersonnelGps/personnelGpsReducer';

import dayReport from './Running/DayReport/dayReportReducer';
import workOrder from './Ticket/WorkOrder/workOrderReducer';
import assetsConfig from './Book/AssetsConfig/assetsConfigReducer';
import deviceManage from './Book/DeviceManage/deviceManageReducer';
import partInfo from './Book/DeviceManage/PartInfo/partInfoReducer';
import deviceAccount from './Book/DeviceAccount/deviceAccountReducer';


const operationReducer = combineReducers({ defect, inspect, ticket,personnelGps, dayReport,workOrder,assetsConfig,deviceManage,partInfo,deviceAccount });

export default operationReducer;
