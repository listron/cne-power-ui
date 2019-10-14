import { combineReducers } from 'redux';
import reportStationReducer from './ReportStation/reportStationReducer';
const reportManageReducer = combineReducers({
  reportStationReducer,

});
export default reportManageReducer;