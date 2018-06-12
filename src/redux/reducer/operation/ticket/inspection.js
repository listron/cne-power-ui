import immutable from 'immutable';
import { BEGIN_FETCH, GET_INSPECTION_LIST_SUCCESS } from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: '',
  inspectionList:[],
  currentPage: 1,
  currentPageSize: 10,
});

const inspectionReducer = (state = initState, action) => {
  console.log(action);
  switch(action.type){
    case BEGIN_FETCH:
      return state.set('isFetching',true)
    case GET_INSPECTION_LIST_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectionList', immutable.fromJS(action.data))
    
  }
  return state;
}


export default inspectionReducer;