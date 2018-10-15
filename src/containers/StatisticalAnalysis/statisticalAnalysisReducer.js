import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';
import productionAnalysisReducer from './StationAnalysis/ProductionAnalysis/productionAnalysisReducer';



const statisticalAnalysisReducer = combineReducers({ allStationAnalysis,productionAnalysisReducer});

export default statisticalAnalysisReducer;
