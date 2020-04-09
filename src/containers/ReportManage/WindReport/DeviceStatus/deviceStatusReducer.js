import Immutable from 'immutable';
import { deviceStatusAction } from './deviceStatusAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  selectStationType: '0',
  loading: false,
  dateType: 1, //day/month/year/custom
  summaryType: 4, //area/station/modal/wind
  summaryData: [],
  tableType: 'all',
  filterTable: 4, //筛选表头，和summaryType值相同，4代表风机
  startTime: moment().format('DD') === '01' ? moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD'),
  endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  sortField: '0',
  sortMethod: 'asc',
  pageSize: 10,
  pageNum: 1,
  total: 0,
  deviceStatusList: [],
  statusDetailList: [],
  regionData: [],
  regionStationData: [],
  stationDevicemodeData: [],
  regionStationDeviceData: [],
});
const deviceStatusReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceStatusAction.changeDeviceStatusStore:
      return state.merge(Immutable.fromJS(action.payload))
    case deviceStatusAction.resetDeviceStatusStore:
      return initState;
  }
  return state;
}
export default deviceStatusReducer;
