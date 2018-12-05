import { combineReducers } from 'redux'

import common from './alphaRedux/commonReducer';
import homepage from './Home/homepageReducer';
import operation from './Operation/operationReducer';
import system from './System/systemReducer';
import login from './Login/loginReducer';
import monitor from './Monitor/monitorReduce';
import alarmReducer from './Monitor/Alarm/alarmReducer';
import otherReducer from './alphaRedux/otherReducer';
import statisticalAnalysisReducer from './StatisticalAnalysis/statisticalAnalysisReducer';
import advanceAanlysisReducer from './HighAnalysis/advanceAanlysisReducer';

const appReducer = combineReducers({
  common, 
  homepage,
  operation, 
  login, 
  system ,
  monitor, 
  alarmReducer, 
  otherReducer,
  statisticalAnalysisReducer,
  advanceAanlysisReducer,
});


export default appReducer

