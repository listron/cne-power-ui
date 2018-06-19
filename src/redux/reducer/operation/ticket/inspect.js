import immutable from 'immutable';
import { BEGIN_FETCH, GET_INSPECT_LIST_SUCCESS ,GET_INSPECT_LIST_FAIL } from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  inspectList:[],
  pageNum: 1,
  pageSize: 10,
  isFetching: false,
  error: {
    code: "",
    message: ""
  },
  status: "5",
  stationType: "2",
  total: 0,
  inspectStatusStatistics: {
    "checkNum": 0,
    "executeNum": 0
  },
  sort: "00",
});

const inspectReducer = (state = initState, action) => {  
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set("isfetching", true)
    case GET_INSPECT_LIST_SUCCESS:
      return state.set("isFetching", false)
                  .set("inspectList", immutable.fromJS(action.data.inspectList))
                  .set("pageNum", action.params.pageNum + 1)
                  .set("pageSize", action.params.pageSize)
                  .set("total", action.data.total)
                  .set("status", action.params.status)
                  .set("inspectStatusStatistics", immutable.fromJS(action.data.inspectStatusStatistics))
                  .set('sort', action.params.sort)
    case GET_INSPECT_LIST_FAIL:
      return state.set("error", immutable.fromJS(action.error))
  }
  return state;
}


export default inspectReducer;