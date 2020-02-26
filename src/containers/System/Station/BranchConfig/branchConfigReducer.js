import Immutable from 'immutable';
import { branchConfigAction } from './branchConfigAction';

const initState = Immutable.fromJS({
  loading: false,
  cancelloadding: false,
  stationsInfo: [],
  deviceTypeData: [],
  deviceNameData: [],
  focus: false,
  selectDeviceFullCode: false,
  isCheckStatus: false,
  checked: false,

  stationCode: null,
  deviceTypeCode: null,
  deviceCodes: [],
  checkTime: '',
  deviceBranchInfo: [],
  copyData: [],
  saveEditArr: [],

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
