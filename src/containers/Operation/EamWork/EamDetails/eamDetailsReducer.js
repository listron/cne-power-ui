import immutable from 'immutable';
import { eamDetailsAction } from './eamDetailsAction';
const initState = immutable.fromJS({
  loading: false,
  eamDetailData: {
    workOrder: {
      workOrderNo: '',
      assetNo1: '',
      assetNo2: '',
      status: '',
      stationName1: '',
      stationName2: '',
      location1: '',
      location2: '',
      createName: '',
      woprofess: '',
      isPick: '',
      createTime: '',
      workOrderType: '',
      stopCheck1: '',
      stopCheck2: '',
      parentWorkOrderNo: '',
      workOrderDesc: '',
      operName1: '',
      operName2: '',
      closeTime: '',
      faultLevel: '',
      clientName1: '',
      clientName2: '',
      faultDiscoverTime: '',
      checkName: '',
      workStartTime: '',
      workEndTime: '',
      leadName: '',
      reason: '',
      content: '',
      overRhaulsy: '',
      overRhaulys: '',
      conclusion: '',
      overhaulbj: '',
      designFault: '',
      dayMaintenanceFault: '',
      partQualityFault: '',
      environmentFault: '',
      powerGridFault: '',
      otherFault: '',
      faultStartTime: '',
      faultEndTime: '',
      keeplength: '',
      faultCode1: '',
      faultCode2: '',
      faultSource: '',
      overRhaulby: '',
    },
    jcx: [],
    assets: [],
    works: [],
    operations: [],
    peaks: [],
    peakDetails: [],
    childOrders: [],
  },
});

const eamDetailsReducer = (state = initState, action) => {
  switch (action.type) {
    case eamDetailsAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamDetailsAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamDetailsAction.resetStore:
      return initState;
  }
  return state;
};

export default eamDetailsReducer;
