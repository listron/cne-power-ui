import { combineReducers } from 'redux';

import department from './account/departmentReducer';
import enterprise from './account/enterpriseReducer';
import role from '../../../containers/System/Account/Role/roleReducer';
import user from './account/userReducer';

import alarmManage from './station/alarmManageReducer';
import stationManage from './station/stationManageReducer';
import deviceManage from './station/deviceManageReducer';
import pointManage from './station/pointManageReducer';

const systemReducer = combineReducers({ department, enterprise, role, user, alarmManage, stationManage, deviceManage, pointManage });

export default systemReducer;