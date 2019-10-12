import { lazy } from 'react';


export const reportManageRoute = [
  {
    path: '/report/station',
    component: lazy(() => import('../../components/Common/Building/Building.jsx')),
  },

];
