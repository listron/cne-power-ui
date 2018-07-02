import immutable from 'immutable';

import {
  COMMON_FETCH,

  GET_TOPMENU_CHANGE_SUCCESS,

  GET_STATIONS_SAGA_SUCCESS,
  GET_STATIONS_SAGA_FAIL,

  GET_DEVICETYPES_SAGA_SUCCESS,
  GET_DEVICETYPES_SAGA_FAIL,
  
  GET_DEVICES_SAGA_SUCCESS,
  GET_DEVICES_SAGA_FAIL,

  GET_PARTITIONS_SAGA_SUCCESS,
  GET_PARTITIONS_SAGA_FAIL
} from '../../constants/actionTypes/commonAction';

var initState = immutable.fromJS({
  topMenu:{
    name: '首页',
    path: '/',
    clickable: true,
  },
  commonFetching: false,
  stations: [],
  deviceTypes: [],
  devices: [],
  partitions: []
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case COMMON_FETCH:
      return state.set('commonFetching', true)
    case GET_TOPMENU_CHANGE_SUCCESS:
      return state.set('topMenu',immutable.fromJS(action.params))
    case GET_STATIONS_SAGA_SUCCESS:
      return state.set('commonFetching', false)
                  .set('stations', immutable.fromJS(action.params.data))
    case GET_DEVICETYPES_SAGA_SUCCESS:
      return state.set('commonFetching', false)
                  .set('deviceTypes',immutable.fromJS(action.params.data));
    case GET_DEVICES_SAGA_SUCCESS:
      return state.set('commonFetching', false)
                  .set('devices',immutable.fromJS(action.params.data));
    case GET_PARTITIONS_SAGA_SUCCESS: 
      return state.set('commonFetching', false)
                  .set('partitions',immutable.fromJS(action.params.data));
    case GET_STATIONS_SAGA_FAIL:
    case GET_DEVICETYPES_SAGA_FAIL:
    case GET_DEVICES_SAGA_FAIL:
    case GET_PARTITIONS_SAGA_FAIL:
  }
  return state;
}


export default defectReducer;