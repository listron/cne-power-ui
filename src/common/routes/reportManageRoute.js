import { lazy } from 'react';


const reportStation = [ // 电站报表
  {
    path: '/report/station',
    component: lazy(() => import('../../containers/ReportManage/ReportStation/ReportStation.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
];

export const reportDevice = [ //设备报表
  {
    path: '/report/device/centerInvert', // 集中式逆变器
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/CenterInvert/CenterInvert.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/device/combineInvert', // 组串式逆变器
    // component: lazy(() => import('../../containers/ReportManage/ReportStation/ReportStation.jsx')),
    component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/device/confluenceBox', // 汇流箱
    // component: lazy(() => import('../../containers/ReportManage/ReportStation/ReportStation.jsx')),
    component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/device/weatherStation', // 气象站
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/WeatherStation/WeatherStation')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
];


export const reportManageRoute = [
  ...reportStation,
  ...reportDevice,
];
