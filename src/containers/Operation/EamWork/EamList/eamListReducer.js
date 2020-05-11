import immutable from 'immutable';
import moment from 'moment';
import {eamListAction} from './eamListAction';

const initState = immutable.fromJS({
  tableLoading: false,
  selectedStation: [],
  eamStationList: [],
  eamTableData: {
    dataList: [],
    pageCount: '0',
  },
  workOrderType: '',
  startTime: moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
  endTime: moment().format('YYYY-MM-DD 23:59:59'),
  pageSize: 10,
  pageNum: 1,
  otherTimeFlag: false,
  loading: false,
  detailFlag: false,
  workOrderNo: '',
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

const eamListReducer = (state = initState, action) => {
  switch (action.type) {
    case eamListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.resetStore:
      return initState;
  }
  return state;
};

export default eamListReducer;
