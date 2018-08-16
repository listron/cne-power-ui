import Immutable from 'immutable';

import { commonAction } from '../../constants/actionTypes/commonAction';

var initState = Immutable.fromJS({
  topMenu:{
    name: '首页',
    path: '/',
    clickable: true,
  },
  enterpriseId:'',
  enterpriseName: '',
  commonFetching: false,
  stations: [],
  deviceTypes: [],
  stationDeviceTypes: [],
  devices: [],
  partitions: []
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case commonAction.COMMON_FETCH:
      return state.set('commonFetching', true)
    case commonAction.CHANGE_COMMON_STORE: 
      return state.merge(Immutable.fromJS(action.payload))
    case commonAction.GET_STATIONS_SUCCESS:
      return state.set('commonFetching', false)
                  .set('stations', Immutable.fromJS(action.params.data))
    case commonAction.GET_DEVICETYPES_SUCCESS:
      return state.set('commonFetching', false)
                  .set('deviceTypes',Immutable.fromJS(action.params.data));
    case commonAction.GET_STATION_DEVICETYPES_SUCCESS:
      return state.set('commonFetching', false)
                  .set('stationDeviceTypes',Immutable.fromJS(action.params.data));
    case commonAction.GET_DEVICES_SUCCESS:
      return state.set('commonFetching', false)
                  .set('devices',Immutable.fromJS(action.params.data));
    case commonAction.GET_PARTITIONS_SUCCESS: 
      return state.set('commonFetching', false)
                  .set('partitions',Immutable.fromJS(action.params.data));
    case commonAction.GET_STATIONS_FAIL:
    case commonAction.GET_STATION_DEVICETYPES_FAIL:
    case commonAction.GET_DEVICES_FAIL:
    case commonAction.GET_PARTITIONS_FAIL:
  }
  return state;
}


export default defectReducer;