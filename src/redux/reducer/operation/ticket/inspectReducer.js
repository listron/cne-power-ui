import immutable from 'immutable';
import { 
  TICKET_FETCH, 
  GET_INSPECT_LIST_SUCCESS, 
  GET_INSPECT_LIST_FAIL,
  SET_INSPECT_ID,
  GET_INSPECT_DETAIL_SUCCESS,
  GET_INSPECT_DETAIL_FAIL,
  ADD_INSPECT_ABNORMAL_SUCCESS,
  ADD_INSPECT_ABNORMAL_FAIL,
  CLEAR_INSPECT_STATE,
  TRANSFORM_DEFECT_SUCCESS,
  TRANSFORM_DEFECT_FAIL,
  SET_INSPECT_CHECK_SUCCESS,
  SET_INSPECT_CHECK_FAIL,
  FINISH_INSPECT_SUCCESS,
  FINISH_INSPECT_FAIL,
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
  
});

const inspectReducer = (state = initState, action) => {
  switch (action.type) {
    case TICKET_FETCH:
      return state.set('isFetching', true);
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
                  .set('inspectDetail', immutable.fromJS(action.data))
    case TRANSFORM_DEFECT_SUCCESS:
      return state.set('isFetching', false)
                  .set('abnormalId', action.collection)
                  .set('inspectId', action.params.inspectId);
    case SET_INSPECT_CHECK_SUCCESS:
      return state.set('isFetching', false)
    case FINISH_INSPECT_SUCCESS:
      return state.set('isFetching', false)
    case GET_INSPECT_LIST_FAIL:
    case GET_INSPECT_DETAIL_FAIL:
    case ADD_INSPECT_ABNORMAL_FAIL:
    case TRANSFORM_DEFECT_FAIL:
    case SET_INSPECT_CHECK_FAIL:
    case FINISH_INSPECT_FAIL:
      return state.set('error', immutable.fromJS(action.error));
  }
  return state;
}


export default inspectReducer;