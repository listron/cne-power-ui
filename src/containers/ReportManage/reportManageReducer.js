import { combineReducers } from 'redux';
import reportStationReducer from './PvReport/ReportStation/reportStationReducer';
import { centerInvert } from './PvReport/ReportDevice/CenterInvert/centerInvertReducer';
import { weatherStation } from './PvReport/ReportDevice/WeatherStation/weatherStationReducer';
import { combineInvert } from './PvReport/ReportDevice/CombineInvert/combineInvertReducer';
import { confluenceBox } from './PvReport/ReportDevice/ConfluenceBox/confluenceBoxReducer';

import powerReportReducer from './WindReport/PowerReport/powerReportReducer';
import deviceStatusReducer from './WindReport/DeviceStatus/deviceStatusReducer';
import malfunctionReducer from './WindReport/Malfunction/malfunctionReducer';
import powerLostReducer from './WindReport/PowerLost/powerLostReducer';
const reportManageReducer = combineReducers({
  powerReportReducer,
  deviceStatusReducer,
  malfunctionReducer,
  powerLostReducer,
  reportStationReducer,
  centerInvert,
  weatherStation,
  combineInvert,
  confluenceBox,
});
export default reportManageReducer;
