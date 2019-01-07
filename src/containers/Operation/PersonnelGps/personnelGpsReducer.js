import Immutable from 'immutable';
import { personnelGpsAction } from './personnelGpsAction';
var initState = Immutable.fromJS({
  loading: false,
  personnelGpsData:[]
});
const personnelGpsReducer = (state = initState, action) => {
  switch (action.type) {
    case personnelGpsAction.PERSONNELGPS_FETCH:
      return state.set('loading', true)
    case personnelGpsAction.GET_PERSONNELGPS_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case personnelGpsAction.CHANGE_PERSONNELGPS_STORE:
      return state.merge(Immutable.fromJS(action.payload))

  }
  return state;
}
export default personnelGpsReducer;
