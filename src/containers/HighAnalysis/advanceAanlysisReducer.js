import { combineReducers } from 'redux';

import cleanoutRecordReducer from './CleanoutModel/CleanoutRecord/cleanoutRecordReducer';
import cleanoutWarningReducer from './CleanoutModel/CleanoutWarning/cleanoutWarningReducer';


const advanceAnalysisReducer = combineReducers({ 
  cleanoutRecordReducer,
  cleanoutWarningReducer,
 
});

export default advanceAnalysisReducer;
