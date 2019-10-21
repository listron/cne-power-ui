import { combineReducers } from 'redux';
import reportStationReducer from './ReportStation/reportStationReducer';
import { centerInvert } from './ReportDevice/CenterInvert/centerInvertReducer';
import { combineInvert } from './ReportDevice/CombineInvert/combineInvertReducer';
const reportManageReducer = combineReducers({
  reportStationReducer,
  centerInvert,
  combineInvert,
});
export default reportManageReducer;
