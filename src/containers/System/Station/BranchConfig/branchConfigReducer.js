import Immutable from 'immutable';
import { branchConfigAction } from './branchConfigAction';

const initState = Immutable.fromJS({
  loading: false,
  stationsInfo: [],
  deviceTypeData: [],
  deviceNameData: [],

  stationCode: null,
  deviceTypeCode: null,
  deviceFullCodes: [],

});

const branchConfigReducer = (state = initState, action) => {
  switch (action.type) {
    case branchConfigAction.changeBranchStore:
      return state.merge(Immutable.fromJS(action.payload));
    case branchConfigAction.resetBranchStore:
      return initState;
  }
  return state;
};

export default branchConfigReducer;
