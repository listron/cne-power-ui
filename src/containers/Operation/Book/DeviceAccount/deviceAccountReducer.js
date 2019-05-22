import Immutable from 'immutable';
import { deviceAccountAction } from './deviceAccountAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  loading: false,
  pageSize: 10,
  pageNum: 1,
  total: 0,
});
const deviceAccountReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceAccountAction.changedeviceAccountStore:
      return state.merge(Immutable.fromJS(action.payload))
    case deviceAccountAction.resetdeviceAccountStore:
      return initState
  }
  return state;
}
export default deviceAccountReducer;