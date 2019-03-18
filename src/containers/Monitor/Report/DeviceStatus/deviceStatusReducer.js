import Immutable from 'immutable';
import { deviceStatusAction } from './deviceStatusAction';

var initState = Immutable.fromJS({
  loading: false,
  dateTypa: 'day',//day/month/year/custom
  summaryType: 'wind',//area/station/modal/wind
  pageSize: 10,
  pageNum: 1,
  total: 0,
  deviceStatusList: [],
  orderField: '',
  orderCommand: '',
});
const deviceStatusReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceStatusAction.changeDeviceStatusStore:
      return state.merge(Immutable.fromJS(action.payload))
    case deviceStatusAction.resetDeviceStatusStore:
      return initState
  }
  return state;
}
export default deviceStatusReducer;