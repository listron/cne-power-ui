import { combineReducers } from 'redux'

import common from './commonReducer';
import operation from './operation/operationReducer';
import system from './system/systemReducer';
import login from './loginReducer';
import monitor from './monitor/monitorReduce';
import alarmReducer from './monitor/alarmReducer';
import otherReducer from './otherReducer';

const appReducer = combineReducers({common, operation, login, system ,monitor, alarmReducer, otherReducer});


export default appReducer
