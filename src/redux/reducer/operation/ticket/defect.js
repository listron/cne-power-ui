import immutable from 'immutable';

import {BEGIN_FETCH, GET_DEFECT_LIST_SUCCESS} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: '',
  fileterAllInfor:[],//顶部筛选所有数据[{stations:[],devices:[]...}]
  selectedFileterInfor: {},//选中的筛选项{selectedStation:[],selectedDevices:[]}
  defectList:[],//渲染为table的缺陷列表
  currentPage: 1,
  currentPageSize: 10,
  total: 100,
  status: "5",
  defectDetail: {
    stationName: "",
    deviceName: "",
    defectTypeName: "",
    defectLevel: 1,
    defectDescribe: "",
    images: [],
    handleData: {
      defectProposal: "",
      defectSolveInfo: "",
      replaceParts: "",
      defectSolveResult: 0,
      status: 3
    }
  }
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true)
    case GET_DEFECT_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('defectList', immutable.fromJS(action.data))
                  .set('currentPage', (action.params.pageNum + 1))
                  .set('currentPageSize', action.params.pageSize)
                  .set('status', action.params.status); 
  }

  return state;
}


export default defectReducer;