import immutable from 'immutable';

// import {
  
// } from '../../constants/actionTypes/Login';

var initState = immutable.fromJS({
  isFetching: false,
  error: '',
});

const defectReducer = (state = initState, action) => {
  // switch (action.type) {
  //   case UPDATE_COUNT:
  //     return state.set('count', action.number)
  //   case GET_COMPINFO_SU_SUCCESS:  
  //     return state.set('isFetching', false)
  //                 .set('domain', immutable.fromJS({
  //                   name: action.data.enterpriseName,
  //                   logo: action.data.enterpriseLogUrl
  //                 })); 
  // }
  return state;
}


export default defectReducer;