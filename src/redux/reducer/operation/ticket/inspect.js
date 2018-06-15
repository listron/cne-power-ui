import immutable from 'immutable';
import { BEGIN_FETCH, GET_INSPECTION_LIST_SUCCESS ,GET_INSPECTION_LIST_FAIL } from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  inspectionList:[],
  pageNum: 1,
  pageSize: 10,
  isFetching: false,
  error: {
    code: "",
    message: ""
  },
  status: 5,
  stationType: "2",
  defectStatusStatistics: {
    "checkNum": 10,
    "executeNum": 110
  },
});

const inspectReducer = (state = initState, action) => {  
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true)
    case GET_INSPECTION_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('inspectionList', immutable.fromJS(action.data))
                  .set('pageNum', action.params.pageNum)
                  .set('pageSize', action.params.pageSize)
                  .set('status', action.params.status)
                  .set('defectStatusStatistics', action.params.inspectStatusStatistics)
    case GET_INSPECTION_LIST_FAIL:
      return state.set('error', immutable.fromJS(action.error))
  }
  return state;
}


export default inspectReducer;