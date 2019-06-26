import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';
import productionAnalysisReducer from './StationAnalysis/ProductionAnalysis/productionAnalysisReducer';
import stationResourceAnalysisReducer from './StationAnalysis/StationResourceAnalysis/stationResourceAnalysisReducer';
import operateAnalysisReducer from './StationAnalysis/OperateAnalysis/operateAnalysisReducer';
import stationContrastReducer from './StationAnalysis/StationContrast/stationContrastReducer';
import performanceAnalysisReducer from "./EquipmentAnalysis/PerformanceAnalysis/performanceAnalysisReducer";
import manufacturers from "./EquipmentAnalysis/Manufacturers/manufacturersReducer";
import customize from "./EquipmentAnalysis/Customize/customizeReducer";
import scoreAnalysis from "./StationAnalysis/ScoreAnalysis/scoreAnalysisReducer";
import intelligentAnalysisReducer from "./StatisticalReport/IntelligentAnalysis/intelligentAnalysisReducer";

const statisticalAnalysisReducer = combineReducers({ 
  allStationAnalysis,
  productionAnalysisReducer,
  operateAnalysisReducer,
  stationResourceAnalysisReducer,
  stationContrastReducer,
  performanceAnalysisReducer,
  manufacturers,
  customize,
  scoreAnalysis,
  intelligentAnalysisReducer,
});

export default statisticalAnalysisReducer;
