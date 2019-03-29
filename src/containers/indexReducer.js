import { combineReducers } from 'redux'

import common from './alphaRedux/commonReducer';
import homepage from './Home/homepageReducer';
import operation from './Operation/operationReducer';
import system from './System/systemReducer';
// import login from './Login/loginReducer';
import { login } from './Login/NewLogin/loginReducer';
import monitor from './Monitor/monitorReduce';
import otherReducer from './alphaRedux/otherReducer';
import statisticalAnalysisReducer from './StatisticalAnalysis/statisticalAnalysisReducer';
import highAanlysisReducer from './HighAnalysis/highAanlysisReducer';

const appReducer = combineReducers({
  common,
  homepage,
  operation,
  login,
  system ,
  monitor,
  otherReducer,
  statisticalAnalysisReducer,
  highAanlysisReducer,
});


export default appReducer

