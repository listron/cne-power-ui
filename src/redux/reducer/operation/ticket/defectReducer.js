import immutable from 'immutable';

import {
  BEGIN_FETCH, 
  GET_DEFECT_LIST_SUCCESS,
  GET_DEFECT_LIST_FAIL,
  SET_DEFECT_ID,
  SET_SELECTED_DEFECT,
  GET_DEFECT_DETAIL_SUCCESS,
  GET_DEFECT_DETAIL_FAIL,
  GET_DEFECTTYPES_SAGA_SUCCESS,
  GET_DEFECTTYPES_SAGA_FAIL,
  DEFECT_CREATE_SAGA_SUCCESS,
  DEFECT_CREATE_SAGA_FAIL,
  GET_DEFECT_LANGUAGE_SUCCESS,
  GET_DEFECT_LANGUAGE_FAIL,
  CLEAR_DEFECT_STATE,
} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  isFetching: false,
  error: {
    code: '',
    message: ''
  },
  fileterAllInfo:[],//顶部筛选所有数据[{stations:[],devices:[]...}]
  selectedFileterInfo: {},//选中的筛选项{selectedStation:[],selectedDevices:[]}
  defectList:[],//渲染为table的缺陷列表
  commonList:[],//获取缺陷常用语列表
  selectedRowKeys: [],
  defectStatusStatistics:{
    submitNum: 0,
    examineNum: 0,
    executeNum: 0,
    checkNum: 0,
  },
  currentPage: 1,
  currentPageSize: 10,
  sort: '',
  total: 0,
  status: '5',
  defectId: '',
  defectDetail: {//缺陷详情
    defectId: '',
    stationName: '',
    deviceName: '',
    defectTypeName: '',
    defectLevel: 1,
    defectDescribe: '',
    defectStatus: '1',
    images: [],
    handleData: {
      defectProposal: '',
      defectSolveInfo: '',
      replaceParts: '',
      defectSolveResult: 0,
      status: '1'
    },
    processData: []
  },
  defectTypes: [],
  createDefectParams: {},
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case BEGIN_FETCH:
      return state.set('isfetching', true);
    case GET_DEFECT_LIST_SUCCESS:  
      return state.set('isFetching', false)
                  .set('total', action.data.total)
                  .set('defectList', immutable.fromJS(action.data.defectList))
                  .set('selectedRowKeys', immutable.fromJS([]))
                  .set('defectStatusStatistics', immutable.fromJS(action.data.defectStatusStatistics))
                  .set('currentPage', (action.params.pageNum + 1))
                  .set('currentPageSize', action.params.pageSize)
                  .set('status', action.params.status)
                  .set('sort', action.params.sort);
    case SET_DEFECT_ID:
      return state.set('defectId', action.data);
    case SET_SELECTED_DEFECT:
      return state.set('selectedRowKeys', immutable.fromJS(action.data));
    case CLEAR_DEFECT_STATE:
      return initState;
    case GET_DEFECT_DETAIL_SUCCESS: 
      return state.set('isFetching', false)
                  .set('defectDetail', immutable.fromJS(action.data))
                  .set('defectId', action.params.defectId);
    case GET_DEFECT_LANGUAGE_SUCCESS: 
      return state.set('isFetching', false)
                  .set('commonList', immutable.fromJS(action.data));
    case GET_DEFECT_LIST_FAIL:
    case GET_DEFECT_DETAIL_FAIL:
    case GET_DEFECT_LANGUAGE_FAIL:
      return state.set('error', immutable.fromJS(action.error));
    case GET_DEFECTTYPES_SAGA_SUCCESS:
      return state.set('isFetching', false)
                  .set('defectTypes', immutable.fromJS(action.data));
    case GET_DEFECTTYPES_SAGA_FAIL:
    case DEFECT_CREATE_SAGA_SUCCESS:
      return state.set('isFetching', false)
                  .set('createDefectParams',action.data);
    case DEFECT_CREATE_SAGA_FAIL:
  }

  return state;
}


export default defectReducer;