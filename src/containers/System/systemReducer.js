import { combineReducers } from 'redux';

import department from './Account/Department/departmentReducer';
import enterprise from './Account/Enterprise/enterpriseReducer';
import role from './Account/Role/roleReducer';
import user from './Account/User/userReducer';

import alarmManage from './Station/AlarmManage/alarmManageReducer';
import stationManage from './Station/StationManage/stationManageReducer';
import deviceManage from './Station/DeviceManage/deviceManageReducer';
import pointManage from './Station/PointManage/pointManageReducer';

const systemReducer = combineReducers({ department, enterprise, role, user, alarmManage, stationManage, deviceManage, pointManage });

export default systemReducer;