import immutable from 'immutable';

import {BEGIN_FETCH, GET_DEFECT_LIST_SUCCESS} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: '',
  fileterAllInfor:[],//顶部筛选所有数据[{stations:[],devices:[]...}]
  selectedFileterInfor: {},//选中的筛选项{selectedStation:[],selectedDevices:[]}
  defectList:[],//渲染为table的缺陷列表
  currentPage: 1,
  currentPageSize: 10
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true)
    case GET_DEFECT_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('defectList', immutable.fromJS(action.data)); 
  }

  return state;
}


export default defectReducer;