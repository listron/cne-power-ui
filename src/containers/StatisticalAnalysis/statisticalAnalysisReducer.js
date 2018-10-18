import { combineReducers } from 'redux';

import allStationAnalysis from './StationAnalysis/AllStationAnalysis/allStationAnalysisReducer';
import productionAnalysisReducer from './StationAnalysis/ProductionAnalysis/productionAnalysisReducer';
import stationResourceAnalysisReducer from './StationAnalysis/StationResourceAnalysis/stationResourceAnalysisReducer';
import operateAnalysisReducer from './StationAnalysis/OperateAnalysis/operateAnalysisReducer';
import stationContrastReducer from './StationAnalysis/StationContrast/stationContrastReducer';

const statisticalAnalysisReducer = combineReducers({ 
  allStationAnalysis,
  productionAnalysisReducer,
  operateAnalysisReducer,
  stationResourceAnalysisReducer,
  stationContrastReducer,
});

export default statisticalAnalysisReducer;
