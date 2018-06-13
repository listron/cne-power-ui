import immutable from 'immutable';
import { BEGIN_FETCH, GET_INSPECTION_LIST_SUCCESS } from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: '',
  fileterAllInfor: [],
  selectedFileterInfor: {},
  inspectionList:[],
  currentPage: 1,
  currentPageSize: 10,
  total: 100,
  status: '5',

});

const inspectionReducer = (state = initState, action) => {  
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true)
    case GET_INSPECTION_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('inspectionList', immutable.fromJS(action.data))
                  .set('currentPage', (action.params.Page + 1))
                  .set('currentPageSize', action.params.pageSize)
                  .set('status', action.params.status) 
  }

  return state;
}


export default inspectionReducer;