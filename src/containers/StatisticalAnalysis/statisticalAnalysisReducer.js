import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';
import productionAnalysisReducer from './StationAnalysis/ProductionAnalysis/productionAnalysisReducer';
import operateAnalysisReducer from './StationAnalysis/OperateAnalysis/operateAnalysisReducer';



const statisticalAnalysisReducer = combineReducers({ allStationAnalysis,productionAnalysisReducer,operateAnalysisReducer});

export default statisticalAnalysisReducer;
