import { combineReducers } from 'redux';

import cleanoutRecordReducer from './CleanoutModel/CleanoutRecord/cleanoutRecordReducer';
import cleanoutWarningReducer from './CleanoutModel/CleanoutWarning/cleanoutWarningReducer';

import unhandleReducer from './EarlyWarning/Unhandle/unhandleReducer'
import ignoreReducer from './EarlyWarning/Ignore/ignoreReducer'
import transFer from './EarlyWarning/Transfer/transferReducer'


const advanceAnalysisReducer = combineReducers({ 
  cleanoutRecordReducer,
  cleanoutWarningReducer,
 
  unhandleReducer,
  ignoreReducer,
  transFer,
});

export default advanceAnalysisReducer;
