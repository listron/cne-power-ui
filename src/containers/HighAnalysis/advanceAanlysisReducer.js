import { combineReducers } from 'redux';

import cleanoutRecordReducer from './CleanoutModel/CleanoutRecord/cleanoutRecordReducer';
import cleanoutWarningReducer from './CleanoutModel/CleanoutWarning/cleanoutWarningReducer';

import unhandle from './EarlyWarning/Unhandle/unhandleReducer'
import ignore from './EarlyWarning/Ignore/ignoreReducer'
import transFer from './EarlyWarning/Transfer/transferReducer'


const advanceAnalysisReducer = combineReducers({ 
  cleanoutRecordReducer,
  cleanoutWarningReducer,
 
  unhandle,
  ignore,
  transFer,
});

export default advanceAnalysisReducer;
