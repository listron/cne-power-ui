import { combineReducers } from 'redux';
import reportStationReducer from './ReportStation/reportStationReducer';
import { centerInvert } from './ReportDevice/CenterInvert/centerInvertReducer';
const reportManageReducer = combineReducers({
  reportStationReducer,
  centerInvert,

});
export default reportManageReducer;
