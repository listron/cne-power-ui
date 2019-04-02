import Immutable from 'immutable';
import { malfunctionAction } from './malfunctionAction';

var initState = Immutable.fromJS({
  loading: false,
  dateTypa: 'day',//day/month/year/custom
  summaryType: 'wind',//area/station/modal/wind
  pageSize: 10,
  pageNum: 1,
  total: 0,
  malfunctionList: [],
  orderField: '',
  orderCommand: '',
});
const malfunctionReducer = (state = initState, action) => {
  switch (action.type) {
    case malfunctionAction.changeMalfunctionStore:
      return state.merge(Immutable.fromJS(action.payload))
    case malfunctionAction.resetMalfunctionStore:
      return initState
  }
  return state;
}
export default malfunctionReducer;