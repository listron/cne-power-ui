import Immutable from 'immutable';
import { powerLostAction } from './powerLostAction';

var initState = Immutable.fromJS({
  loading: false,
  dateTypa: 'day',//day/month/year/custom
  summaryType: 'wind',//area/station/modal/wind
  pageSize: 10,
  pageNum: 1,
  total: 0,
  powerLostList: [],
  orderField: '',
  orderCommand: '',
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