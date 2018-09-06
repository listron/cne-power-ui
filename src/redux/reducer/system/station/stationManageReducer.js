import Immutable from 'immutable';

import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';

var initState = Immutable.fromJS({
  loading: false,
  testWords: '电站管理管理的-----测试数据',
});

const stationManageReducer = (state = initState, action) => {
  switch (action.type) {
    case stationManageAction.STATION_MANAGE_FETCH:
      return state.set('loading',true)
    case stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case stationManageAction.CHANGE_STATION_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}

export default stationManageReducer;