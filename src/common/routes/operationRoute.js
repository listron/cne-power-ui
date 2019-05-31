import { lazy } from 'react';

const ticket = [
  { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    component: lazy(() => import('../../containers/Operation/Ticket/Ticket')),
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
];

const twoTickets = [
  { // 两票管理>第一种工作票
    path: '/operation/twoTickets/typeone',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, { // 第二种工作票
    path: '/operation/twoTickets/typetwo',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
];

const book = [
  { // 资产配置
    path: '/operation/book/assetsConfig',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/AssetsConfig/AssetsConfig')),
  }, { // 设备管理
    path: '/operation/book/deviceManage',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/DeviceManage/DeviceManage')),
  }, { // 设备台账
    path: '/operation/book/deviceAccount',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, { // 仓库配置
    path: '/operation/book/warehouse',
    // component: lazy(() => import('../../components/Common/Building/Building')),
    component: lazy(() => import('../../containers/Operation/Book/Warehouse/Warehouse')),
  }, { // 仓库管理
    path: '/operation/book/warehouseManage',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, { // 出入库记录
    path: '/operation/book/immigrationRecords',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
];

const runningReport = [
  { // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    component: lazy(() => import('../../containers/Operation/Running/DayReport/DayReport')),
  }, { // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
]

export const operationRoute = [
  { // 运维管理-工单-员工定位
    path: '/operation/gps',
    //component: Building,
    component: lazy(() => import('../../containers/Operation/PersonnelGps/PersonnelGps')),
  },
  ...ticket,
  ...twoTickets,
  ...book,
  ...runningReport,
  { // 运维管理-智能专家库
    path: '/operation/intelligentExpert',
    component: lazy(() => import('../../containers/Operation/IntelligentExpert/IntelligentExpert')),
  }
];