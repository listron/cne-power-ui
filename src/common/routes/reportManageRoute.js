import { lazy } from 'react';


const reportStation = [ // 风电报表
  {
    path: '/report/windstation/powerReport',
    component: lazy(() => import('../../containers/ReportManage/WindReport/PowerReport/PowerReport')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/windstation/deviceStatus',
    component: lazy(() => import('../../containers/ReportManage/WindReport/DeviceStatus/DeviceStatus')),
  },
  {
    path: '/report/windstation/malfunction',
    component: lazy(() => import('../../containers/ReportManage/WindReport/Malfunction/Malfunction')),
  },
  {
    path: '/report/windstation/powerLost',
    component: lazy(() => import('../../containers/ReportManage/WindReport/PowerLost/PowerLost')),
  },
];

export const reportDevice = [ //光伏报表
  {
    path: '/report/pvstation/station',
    component: lazy(() => import('../../containers/ReportManage/PvReport/ReportStation/ReportStation.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/centerInvert', // 逆变器（集中）
    component: lazy(() => import('../../containers/ReportManage/PvReport/ReportDevice/CenterInvert/CenterInvert.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/combineInvert', // 逆变器（组串）
    component: lazy(() => import('../../containers/ReportManage/PvReport/ReportDevice/CombineInvert/CombineInvert.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/confluenceBox', // 汇流箱
    component: lazy(() => import('../../containers/ReportManage/PvReport/ReportDevice/ConfluenceBox/ConfluenceBox.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/weatherStation', // 气象站
    component: lazy(() => import('../../containers/ReportManage/PvReport/ReportDevice/WeatherStation/WeatherStation')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
];


export const reportManageRoute = [
  ...reportStation,
  ...reportDevice,
];

