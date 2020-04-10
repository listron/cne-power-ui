import Immutable from 'immutable';
import { powerLostAction } from './powerLostAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  selectStationType: '0',
  loading: false,
  dateType: 1, //day/month/year/custom
  summaryType: 4, //area/station/modal/wind
  filterTable: 4, //筛选table表头用的,根据不同的值展现不同的table表头，4代表风机
  summaryData: [],
  startTime: moment().format('DD') === '01' ? moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD'),
  endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  sortField: '0',
  sortMethod: 'asc',
  pageSize: 10,
  pageNum: 1,
  total: 0,
  powerReportList: [],
  regionData: [],
  regionStationData: [],
  stationDevicemodeData: [],
  regionStationDeviceData: [],
  powerLostList: [],
  
});
const powerLostReducer = (state = initState, action) => {
  switch (action.type) {
    case powerLostAction.changePowerLostStore:
      return state.merge(Immutable.fromJS(action.payload))
    case powerLostAction.resetPowerLostStore:
      return initState
  }
  return state;
}
export default powerLostReducer;