import { combineReducers } from 'redux';

import { workStage } from './WorkStage/workStageReducer';
import { workPlan } from './WorkPlan/workPlanReducer';

import defect from './Ticket/Defect/defectReducer';
import inspect from './Ticket/Inspect/inspectReducer';
import ticket from './Ticket/ticketReducer';
import personnelGps from './PersonnelGps/personnelGpsReducer';

import dayReport from './Running/DayReport/dayReportReducer';
import meterReadSet from './Running/MeterReadSet/meterReadSetReducer';
import workOrder from './Ticket/WorkOrder/workOrderReducer';
import assetsConfig from './Book/AssetsConfig/assetsConfigReducer';
import deviceManage from './Book/DeviceManage/deviceManageReducer';
import partInfo from './Book/DeviceManage/PartInfo/partInfoReducer';
import deviceAccount from './Book/DeviceAccount/deviceAccountReducer';
import warehouse from './Book/Warehouse/warehouseReducer';
import stockRecords from './Book/StockRecords/stockRecordsReducer';
import { warehouseManage } from './Book/WarehouseManage/warehouseManageReducer';
import intelligentExpert from './IntelligentExpert/intelligentExpertReducer';
import casePartReducer from './CaseSet/casePartReducer';
import eamList from './EamWork/EamList/eamListReducer';
import eamDetails from './EamWork/EamDetails/eamDetailsReducer';

import { examiner } from './TwoTickets/Examiner/examinerReducer'; // 两票 - 审核人
import workFlow from './TwoTickets/WorkFlow/workFlowReducer'; // 两票 - 工作票
import operateFlow from './TwoTickets/OperateFlow/operateFlowReducer'; // 两票 - 操作票

import { defectList } from './WorkProcess/DefectList/defectListReducer'; // 缺陷列表
import { defectDetail } from './WorkProcess/DefectDetail/defectDetailReducer'; //缺陷详情
import { inspectList } from './WorkProcess/InspectList/inspectListReducer'; // 巡检列表
import { inspectDetail } from './WorkProcess/InspectDetail/inspectDetailReducer'; //巡检详情

import { eliminateDefectList } from './NewWorkProcess/EliminateDefectList/defectListReducer'; // 新的消缺列表
import { eliminateDefectDetail } from './NewWorkProcess/EliminateDefectDetail/defectDetailReducer'; //新消缺详情
import { newInspectList } from './NewWorkProcess/NewInspectList/inspectListReducer'; // 新巡检列表
import { newInspectDetail } from './NewWorkProcess/NewInspectDetail/inspectDetailReducer'; //新巡检详情
import { newMeterList } from './NewWorkProcess/NewMeterList/meterListReducer'; // 新新抄表列表
import { newMeterDetail } from './NewWorkProcess/NewMeterDetail/meterDetailReducer'; // 新抄表详情

const operationReducer = combineReducers({
  workStage, // 工作台
  workPlan, // 工作管理计划
  defect,
  inspect,
  ticket,
  eamList,
  eamDetails,
  personnelGps,
  dayReport,
  meterReadSet,
  workOrder,
  assetsConfig,
  deviceManage,
  partInfo,
  warehouse,
  stockRecords,
  warehouseManage,
  intelligentExpert,
  deviceAccount,
  examiner,
  workFlow,
  operateFlow,
  casePartReducer,

  defectList, // 缺陷列表
  defectDetail, //缺陷详情
  inspectList, // 巡检列表
  inspectDetail, //巡检详情

  eliminateDefectList, // 新缺陷列表
  eliminateDefectDetail, //新缺陷详情
  newInspectList, // 新巡检列表
  newInspectDetail, //新巡检详情
  newMeterList, // 新抄表列表
  newMeterDetail, // 新抄表详情
});


export default operationReducer;
