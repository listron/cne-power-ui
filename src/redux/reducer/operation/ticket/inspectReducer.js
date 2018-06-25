import immutable from 'immutable';
import { 
  BEGIN_FETCH, 
  GET_INSPECT_LIST_SUCCESS, 
  GET_INSPECT_LIST_FAIL,
  SET_INSPECT_ID,
  GET_INSPECT_DETAIL_SUCCESS,
  GET_INSPECT_DETAIL_FAIL,
  ADD_INSPECT_ABNORMAL_SUCCESS,
  ADD_INSPECT_ABNORMAL_FAIL,
  GET_DEVICE_TYPE_LIST_SUCCESS,
  GET_DEVICE_TYPE_LIST_FAIL,
  CLEAR_INSPECT_STATE, 
} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  inspectList:[],
  pageNum: 1,
  pageSize: 10,
  isFetching: false,
  error: {
    code: '',
    message: ''
  },
  status: '5',
  stationType: '2',
  total: 0,
  inspectStatusStatistics: {
    checkNum: 0,
    executeNum: 0
  },
  sort: '0,0',
  inspectId: '',
  inspectDetail: {//巡检详情
    inspectId: '',
    stationCode: '',
    stationName: '',
    stationType: '',
    inspectName: '',
    createTime: '',
    deadLine: '',
    abnormalData: {
      abnormalId: '',
      deviceTypeCode: '',
      deviceTypeName: '',
      deviceCode: '',
      deviceName: '',
      defectTypeCode: '',
      defectTypeName: '',
      photoAddress: '',
      isTransform: ''
    },
    processData:[],
    inspectStatus: '',
    deviceTypeNames: '',
  },
  deviceTypeList:[],
  
});

const inspectReducer = (state = initState, action) => {
  console.log("action:")
  console.log(action)
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true);
    case CLEAR_INSPECT_STATE:
      return initState;
    case GET_INSPECT_LIST_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectList', immutable.fromJS(action.data.inspectList))
                  .set('pageNum', action.params.pageNum + 1)
                  .set('pageSize', action.params.pageSize)
                  .set('total', action.data.total)
                  .set('status', action.params.status)
                  .set('inspectStatusStatistics', immutable.fromJS(action.data.inspectStatusStatistics))
                  .set('sort', action.params.sort);
    case SET_INSPECT_ID:
      return state.set('inspectId', action.data);
    case GET_INSPECT_DETAIL_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectDetail', immutable.fromJS(action.data))
                  .set('inspectId', action.params.inspectId);
    case ADD_INSPECT_ABNORMAL_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectDetail', immutable.fromJS(action.data));
    case GET_DEVICE_TYPE_LIST_SUCCESS:
      return state.set('isFetching', false)
                  .set('deviceTypeList', immutable.fromJS(action.data.data));
    case GET_INSPECT_LIST_FAIL:
    case GET_INSPECT_DETAIL_FAIL:
    case ADD_INSPECT_ABNORMAL_FAIL:
    case GET_DEVICE_TYPE_LIST_FAIL:
      return state.set('error', immutable.fromJS(action.error));
  }
  return state;
}


export default inspectReducer;