import { combineReducers } from 'redux';
import reportStationReducer from './ReportStation/reportStationReducer';
import { centerInvert } from './ReportDevice/CenterInvert/centerInvertReducer';
import { weatherStation } from './ReportDevice/WeatherStation/weatherStationReducer';
import { combineInvert } from './ReportDevice/CombineInvert/combineInvertReducer';
import { confluenceBox } from './ReportDevice/ConfluenceBox/confluenceBoxReducer';

const reportManageReducer = combineReducers({
  reportStationReducer,
  centerInvert,
  weatherStation,
  combineInvert,
  confluenceBox,
});
export default reportManageReducer;
