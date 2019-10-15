import { combineReducers } from 'redux';

import common from './alphaRedux/commonReducer';
import homepage from './Home/homepageReducer';
import operation from './Operation/operationReducer';
import system from './System/systemReducer';
import login from './Login/loginReducer';
import monitor from './Monitor/monitorReduce';
import othersReducer from './alphaRedux/othersReducer';
// import otherReducer from './alphaRedux/otherReducer';
import statisticalAnalysisReducer from './StatisticalAnalysis/statisticalAnalysisReducer';
import highAanlysisReducer from './HighAnalysis/highAanlysisReducer';
import reportManageReducer from './ReportManage/reportManageReducer';

const appReducer = combineReducers({
  common,
  homepage,
  operation,
  login,
  system,
  monitor,
  othersReducer,
  // otherReducer,
  statisticalAnalysisReducer,
  highAanlysisReducer,
  reportManageReducer,
});


export default appReducer;

