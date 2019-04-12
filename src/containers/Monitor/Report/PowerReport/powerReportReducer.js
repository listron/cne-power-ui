import Immutable from 'immutable';
import { powerReportAction } from './powerReportAction';

var initState = Immutable.fromJS({
  loading: false,
  dateTypa: 0,//day/month/year/custom
  summaryType: 1,//area/station/modal/wind
  summaryData:[],
  startTime:'',
  endTime:'',
  sortField:'0',
  sortMethod:'asc',
  pageSize: 10,
  pageNum: 1,
  total: 0,
  powerReportList: [],
  orderField: '',
  orderCommand: '',
  regionData: [],
  regionStationData: [],
  stationDevicemodeData: [],
  regionStationDeviceData: [],
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