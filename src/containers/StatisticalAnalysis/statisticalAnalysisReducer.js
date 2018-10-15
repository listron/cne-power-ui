import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';


const statisticalAnalysisReducer = combineReducers({ allStationAnalysis,});

export default statisticalAnalysisReducer;
