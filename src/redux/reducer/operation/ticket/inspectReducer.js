import immutable from 'immutable';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';


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
    abnormalData: [],
    processData:[],
    inspectStatus: '',
    deviceTypeNames: '',
    abnormalIsShow: false,
  },
  inspectStandard: [],
});

const inspectReducer = (state = initState, action) => {
  switch (action.type) {
    case TicketAction.TICKET_FETCH:
      return state.set('isFetching', true);
    case TicketAction.CLEAR_INSPECT_STATE:
      return initState;
    case TicketAction.GET_INSPECT_LIST_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectList', immutable.fromJS(action.data.inspectList))
                  .set('pageNum', action.params.pageNum + 1)
                  .set('pageSize', action.params.pageSize)
                  .set('total', action.data.total)
                  .set('status', action.params.status)
                  .set('inspectStatusStatistics', immutable.fromJS(action.data.inspectStatusStatistics))
                  .set('sort', action.params.sort);
    case TicketAction.SET_INSPECT_ID:
      return state.set('inspectId', action.data);
    case TicketAction.GET_INSPECT_DETAIL_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectDetail', immutable.fromJS(action.data))
                  .set('inspectId', action.params.inspectId);
    case TicketAction.GET_INSPECT_STANDARD_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectStandard', immutable.fromJS(action.data.data));
    case TicketAction.GET_INSPECT_LIST_FAIL:
    case TicketAction.GET_INSPECT_DETAIL_FAIL:
    case TicketAction.ADD_INSPECT_ABNORMAL_FAIL:
    case TicketAction.TRANSFORM_DEFECT_FAIL:
    case TicketAction.SET_INSPECT_CHECK_FAIL:
    case TicketAction.FINISH_INSPECT_FAIL:
    case TicketAction.CREATE_INSPECT_FAIL:
    case TicketAction.GET_INSPECT_STANDARD_FAIL:
      return state.set('error', immutable.fromJS(action.error));
  }
  return state;
}


export default inspectReducer;