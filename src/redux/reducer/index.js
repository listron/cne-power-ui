import { combineReducers } from 'redux'

import common from './commonReducer';
import operation from './operation/operationReducer';
import system from '../../containers/System/systemReducer';
import login from './loginReducer';
import monitor from './monitor/monitorReduce';
import alarmReducer from '../../containers/Monitor/Alarm/alarmReducer';
import otherReducer from './otherReducer';

const appReducer = combineReducers({common, operation, login, system ,monitor, alarmReducer, otherReducer});


export default appReducer
