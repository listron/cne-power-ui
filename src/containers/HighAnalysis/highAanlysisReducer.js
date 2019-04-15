import { combineReducers } from 'redux';


import realtimeWarningReducer from './IntelligentWarning/RealTimeWarning/realtimeWarningReducer';
import transferFormReducer from './IntelligentWarning/Transfer/transferFormReducer';
import handleRemoveReducer from './IntelligentWarning/HandleRemove/handleRemoveReducer';
import historyWarningReducer from './IntelligentWarning/HistoryWarning/historyWarningReducer';

import cleanoutRecordReducer from './CleanoutModel/CleanoutRecord/cleanoutRecordReducer';
import cleanWarning from './CleanoutModel/CleanWarning/cleanWarningReducer';

import unhandle from './EarlyWarning/Unhandle/unhandleReducer'
import ignore from './EarlyWarning/Ignore/ignoreReducer'
import transFer from './EarlyWarning/Transfer/transferReducer'
import historyWarn from './EarlyWarning/HistoryWarn/historyWarnReducer'

import faultWarn from './FaultDiagnose/FaultWarn/faultWarnReducer';


const highAnalysisReducer = combineReducers({
  realtimeWarningReducer,
  transferFormReducer,
  handleRemoveReducer,
  historyWarningReducer,

  cleanoutRecordReducer,
  cleanWarning,

  unhandle,
  ignore,
  transFer,
  historyWarn,

  faultWarn

});

export default highAnalysisReducer;
