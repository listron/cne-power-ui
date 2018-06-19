import immutable from 'immutable';

import {
  BEGIN_FETCH, 
  GET_DEFECT_LIST_SUCCESS,
  GET_DEFECT_LIST_FAIL,
  SET_DEFECT_ID
} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: {
    code: "",
    message: ""
  },
  fileterAllInfor:[],//顶部筛选所有数据[{stations:[],devices:[]...}]
  selectedFileterInfor: {},//选中的筛选项{selectedStation:[],selectedDevices:[]}
  defectList:[],//渲染为table的缺陷列表
  defectStatusStatistics:{
    submitNum: 0,
    examineNum: 0,
    executeNum: 0,
    checkNum: 0,
  },
  currentPage: 1,
  currentPageSize: 10,
  total: 0,
  status: "5",
  defectId: "",
  defectDetail: {//缺陷详情
    defectId: "",
    stationName: "",
    deviceName: "",
    defectTypeName: "",
    defectLevel: 1,
    defectDescribe: "",
    defectStatus: "1",
    images: [],
    handleData: {
      defectProposal: "",
      defectSolveInfo: "",
      replaceParts: "",
      defectSolveResult: 0,
      status: "1"
    },
    processData: []
  }
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set("isfetching", true)
    case GET_DEFECT_LIST_SUCCESS:  
      return state.set("isFetching", false)
                  .set("total", action.data.total)
                  .set("defectList", immutable.fromJS(action.data.defectList))
                  .set("defectStatusStatistics", immutable.fromJS(action.data.defectStatusStatistics))
                  .set("currentPage", (action.params.pageNum + 1))
                  .set("currentPageSize", action.params.pageSize)
                  .set("status", action.params.status);
    case SET_DEFECT_ID:
      return state.set("defectId", action.data);
    case GET_DEFECT_LIST_SUCCESS: 
      return state.set("isFetching", false)
                  .set("defectDetail", immutable.fromJS(action.data))
                  .set("defectId", action.params.defectId);
    case GET_DEFECT_LIST_FAIL:
      return state.set("error", immutable.fromJS(action.error));
  }

  return state;
}


export default defectReducer;