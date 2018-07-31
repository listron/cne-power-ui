import { combineReducers } from 'redux';

import department from './account/departmentReducer';
import enterprise from './account/enterpriseReducer';
import role from './account/roleReducer';
import user from './account/userReducer';

const systemReducer = combineReducers({ department, enterprise, role, user });

export default systemReducer;