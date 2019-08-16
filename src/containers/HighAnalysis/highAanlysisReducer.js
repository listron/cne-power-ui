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
import faultWarnList from './FaultDiagnose/FaultWarnList/faultWarnListReducer';
import faultAllFan from './FaultDiagnose/FaultAllFan/faultAllFanReducer';
import faultSingleFan from './FaultDiagnose/FaultSingleFan/faultSingleFanReducer';
import algorithm from './FaultDiagnose/AlgorithmControl/algorithmControlReducer';
import historyWarnReducer from './FaultDiagnose/HistoryWarn/historyWarnReducer';

import { achieveLayout } from './Achievement/achieveReducer'; // 风电绩效分析-公用信息
import { achieveGroup } from './Achievement/GroupAchieve/groupAchieveReducer'; // 风电绩效分析-集团
import { achieveArea } from './Achievement/AreaAchieve/areaAchieveReducer'; // 风电绩效分析-区域
import { achieveStation } from './Achievement/StationAchieve/stationAchieveReducer'; // 风电绩效分析-电站
import { achieveRun } from './Achievement/RunAchieve/runAchieveReducer'; // 风电绩效分析-运行


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

  faultWarn,
  faultWarnList,
  algorithm,
  faultAllFan,
  faultSingleFan,
  historyWarnReducer,

  achieveLayout,
  achieveGroup,
  achieveArea,
  achieveStation,
  achieveRun,
});

export default highAnalysisReducer;
