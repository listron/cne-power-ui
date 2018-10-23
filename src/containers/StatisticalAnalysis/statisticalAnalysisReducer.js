import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';
import productionAnalysisReducer from './StationAnalysis/ProductionAnalysis/productionAnalysisReducer';
import stationResourceAnalysisReducer from './StationAnalysis/StationResourceAnalysis/stationResourceAnalysisReducer';
import operateAnalysisReducer from './StationAnalysis/OperateAnalysis/operateAnalysisReducer';

import performanceAnalysisReducer from "./EquipmentAnalysis/PerformanceAnalysis/performanceAnalysisReducer";





const statisticalAnalysisReducer = combineReducers({ 
  allStationAnalysis,
  productionAnalysisReducer,
  operateAnalysisReducer,
  stationResourceAnalysisReducer,
  performanceAnalysisReducer
});

export default statisticalAnalysisReducer;
