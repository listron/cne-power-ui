import immutable from 'immutable';
import { BEGIN_FETCH, GET_INSPECTION_LIST_SUCCESS } from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  inspectionList:[],
  pageNum: 1,
  pageSize: 10,
  isFetching: false,
  error: '',
  fileterAllInfor: [],
  selectedFileterInfor: {},
  total: 100,
  status: 5,
  stationType: "2",

});

const inspectionReducer = (state = initState, action) => {  
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true)
    case GET_INSPECTION_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('inspectionList', immutable.fromJS(action.data))
                  .set('pageNum', action.params.pageNum)
                  .set('pageSize', action.params.pageSize)
                  .set('status', action.params.status) 
  }
  return state;
}


export default inspectionReducer;