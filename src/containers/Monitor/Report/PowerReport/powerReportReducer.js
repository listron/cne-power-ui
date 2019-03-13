import Immutable from 'immutable';
import { powerReportAction } from './powerReportAction';

var initState = Immutable.fromJS({
  loading:false,
  dateTypa:'day',//day/month/year/custom
  dateRange:[],
  summaryType:'wind',//area/station/modal/wind
  stationList:[],
  pageSize:10,
  pageNum:1, 
  total:0,
  powerReportList:[],
  orderField:'',
  orderCommand:'',
  year:'',
  month:''
  
});
const powerReportReducer = (state = initState, action) => {
  switch (action.type) {
    case powerReportAction.changePowerReportStore:
      return state.merge(Immutable.fromJS(action.payload))
    case powerReportAction.resetPowerReportStore:
      return initState
  }
  return state;
}
export default powerReportReducer;