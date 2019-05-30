import Immutable from 'immutable';

import { stationManageAction } from './stationManageAction';

var initState = Immutable.fromJS({
  loading: false,
});

const stationManageReducer = (state = initState, action) => {
  switch (action.type) {
    case stationManageAction.changeWeatherStationStore:
      return state.merge(Immutable.fromJS(action.payload))
    case stationManageAction.resetStore:
      return initState
  }
  return state;
}

export default stationManageReducer;