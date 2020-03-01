import { lazy } from 'react';

// const ticket = [
//   {
//     // 运维管理-工单-工单列表
//     path: '/operation/ticket/list',
//     component: lazy(() => import('../../containers/Operation/Ticket/Ticket')),
//   },
//    {
//     // 运维管理-工单-工单统计
//     path: '/operation/ticket/statistics',
//     component: lazy(() => import('../../components/Common/Building/Building')),
//   },
// ];


const ticket = [
  {
    // 运维管理-工单-工单列表
    path: '/operation/workProcess/view',
    component: lazy(() => import('../../containers/Operation/WorkProcess/OverView/Overview.jsx')),
  },
  {
    // 运维管理-工单-工单列表
    path: '/operation/workProcess/newView',
    component: lazy(() => import('../../containers/Operation/NewWorkProcess/NewOverView/Overview.jsx')),
  },
  {
    // 运维管理-工单-工单统计
    path: '/operation/workProcess/statistics',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
];

const twoTickets = [
  {
    // 审核人设置
    path: '/operation/twoTickets/examiner',
    component: lazy(() => import('../../containers/Operation/TwoTickets/Examiner/Examiner')),
  }, {
    // 两票管理>工作票
    path: '/operation/twoTickets/workflow',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/TwoTickets/WorkFlow/WorkFlow')),
  }, {
    // 第二种工作票
    path: '/operation/twoTickets/operateflow',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/TwoTickets/OperateFlow/OperateFlow')),
  },
];

const book = [
  {
    // 资产配置
    path: '/operation/book/assetsConfig',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/AssetsConfig/AssetsConfig')),
  }, {
    // 设备管理
    path: '/operation/book/deviceManage',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/DeviceManage/DeviceManage')),
  }, {
    // 设备台账
    path: '/operation/book/deviceAccount',
    component: lazy(() => import('../../containers/Operation/Book/DeviceAccount/DeviceAccount')),
  }, {
    // 仓库配置
    path: '/operation/book/warehouse',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/Warehouse/Warehouse')),
  }, {
    // 仓库管理
    path: '/operation/book/warehouseManage',
    component: lazy(() => import('../../containers/Operation/Book/WarehouseManage/WarehouseManage')),
  }, {
    // 出入库记录
    path: '/operation/book/stockRecords',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/StockRecords/StockRecords')),
  },
];

const runningReport = [
  {
    // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    component: lazy(() => import('../../containers/Operation/Running/DayReport/DayReport')),
  }, {
    // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, {
    // 运维管理-电站运行-抄表设置
    path: '/operation/running/meterReadSet',
    component: lazy(() => import('../../containers/Operation/Running/MeterReadSet/MeterReadSet')),
  },

];

export const operationRoute = [
  {
    path: '/operation/workStage',
    component: lazy(() => import('../../containers/Operation/WorkStage/WorkStage')),
  }, {
    path: '/operation/workPlan',
    component: lazy(() => import('../../containers/Operation/WorkPlan/WorkPlan')),
  }, {
    // 运维管理-工单-员工定位
    path: '/operation/gps',
    //component: Building,
    component: lazy(() => import('../../containers/Operation/PersonnelGps/PersonnelGps')),
  },
  ...ticket,
  ...twoTickets,
  ...book,
  ...runningReport,
  {
    // 运维管理-智能专家库
    path: '/operation/intelligentExpert',
    component: lazy(() => import('../../containers/Operation/IntelligentExpert/IntelligentExpert')),
  }, {
    // 运维管理-智能专家库
    path: '/operation/caseSet',
    component: lazy(() => import('../../containers/Operation/CaseSet/CasePart')),
  },
];
