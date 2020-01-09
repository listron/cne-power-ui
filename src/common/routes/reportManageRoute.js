import { lazy } from 'react';


const reportStation = [ // 电站报表
  {
    path: '/report/windstation/powerReport',
    component: lazy(() => import('../../containers/Monitor/Report/PowerReport/PowerReport')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/windstation/deviceStatus',
    component: lazy(() => import('../../containers/Monitor/Report/DeviceStatus/DeviceStatus')),
  },
  {
    path: '/report/windstation/malfunction',
    component: lazy(() => import('../../containers/Monitor/Report/Malfunction/Malfunction')),
  },
  {
    path: '/report/windstation/powerLost',
    component: lazy(() => import('../../containers/Monitor/Report/PowerLost/PowerLost')),
  },
];

export const reportDevice = [ //设备报表
  {
    path: '/report/pvstation/station',
    component: lazy(() => import('../../containers/ReportManage/ReportStation/ReportStation.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/centerInvert', // 逆变器（集中）
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/CenterInvert/CenterInvert.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/combineInvert', // 逆变器（组串）
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/CombineInvert/CombineInvert.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/confluenceBox', // 汇流箱
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/ConfluenceBox/ConfluenceBox.jsx')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
  {
    path: '/report/pvstation/weatherStation', // 气象站
    component: lazy(() => import('../../containers/ReportManage/ReportDevice/WeatherStation/WeatherStation')),
    // component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },
];


export const reportManageRoute = [
  ...reportStation,
  ...reportDevice,
];
