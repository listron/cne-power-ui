import {combineReducers} from 'redux';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';
import personnelGps from './PersonnelGps/personnelGpsReducer';

import dayReport from './Running/DayReport/dayReportReducer';
import workOrder from './Ticket/WorkOrder/workOrderReducer';
import assetsConfig from './Book/AssetsConfig/assetsConfigReducer';
import deviceManage from './Book/DeviceManage/deviceManageReducer';
import partInfo from './Book/DeviceManage/PartInfo/partInfoReducer';
import warehouse from './Book/Warehouse/warehouseReducer';
import { warehouseManage } from './Book/WarehouseManage/warehouseManageReducer';
import intelligentExpert from './IntelligentExpert/intelligentExpertReducer'

const operationReducer = combineReducers({
  defect,
  inspect,
  ticket,
  personnelGps,
  dayReport,
  workOrder,
  assetsConfig,
  deviceManage,
  partInfo,
  warehouse,
  warehouseManage,
  intelligentExpert
});

export default operationReducer;
