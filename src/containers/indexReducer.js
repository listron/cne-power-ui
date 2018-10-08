import { combineReducers } from 'redux'

import common from './alphaRedux/commonReducer';
import operation from './Operation/operationReducer';
import system from './System/systemReducer';
import login from './Login/loginReducer';
import monitor from './Monitor/monitorReduce';
import alarmReducer from './Monitor/Alarm/alarmReducer';
import otherReducer from './alphaRedux/otherReducer';

const appReducer = combineReducers({common, operation, login, system ,monitor, alarmReducer, otherReducer});


export default appReducer

