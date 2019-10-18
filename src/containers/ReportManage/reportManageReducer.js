import { combineReducers } from 'redux';
import reportStationReducer from './ReportStation/reportStationReducer';
import { centerInvert } from './ReportDevice/CenterInvert/centerInvertReducer';
import { weatherStation } from './ReportDevice/WeatherStation/weatherStationReducer';
const reportManageReducer = combineReducers({
  reportStationReducer,
  centerInvert,
  weatherStation,

});
export default reportManageReducer;
