import { combineReducers } from 'redux';

import cleanoutRecordReducer from './CleanoutModel/CleanoutRecord/cleanoutRecordReducer';
import cleanWarning from './CleanoutModel/CleanWarning/cleanWarningReducer';

import unhandle from './EarlyWarning/Unhandle/unhandleReducer'
import ignore from './EarlyWarning/Ignore/ignoreReducer'
import transFer from './EarlyWarning/Transfer/transferReducer'


const highAnalysisReducer = combineReducers({ 
  cleanoutRecordReducer,
  cleanWarning,
 
  unhandle,
  ignore,
  transFer,
});

export default highAnalysisReducer;
