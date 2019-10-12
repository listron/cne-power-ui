import { lazy } from 'react';


export const reportManageRoute = [
  {
    path: '/report/station',
    component: lazy(() => import('../../containers/ReportManage/ReportStation/ReportStation.jsx')),
  },

];
