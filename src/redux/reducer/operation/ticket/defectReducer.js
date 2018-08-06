import immutable from 'immutable';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';

var initState = immutable.fromJS({
  isFetching: false,
  error: {
    code: '',
    message: ''
  },
  stationType: '2',    //	电站类型(0:风电，1光伏，2：全部)
  stationCodes: '',    // 电站编码，所有为空字符串
  defectSource: '3',   // string  3：全部，0：告警，1：手动，2：巡检
  defectLevel: '0',	   // String	是	缺陷级别（0：全部，1：一级，2：二级，3：三级，4：四级）
  timeInterval: '0',   //	String	是	时间段（0：全部，1：今天，2：近三天，3：一周内，4：一个月）
  status:'5',          //	String	是	工单状态代码状态（0：待提交:1：待审核、2：执行中、3：待验收、4：已完成、5：所有）
  pageNum: 0,          //	Int	否	页号
  pageSize: 10,        //	Int	否	每页记录数
  createTimeStart: '', //	String	是	创建时间（开始）
  createTimeEnd: '',	 // String	是	创建时间（结束）
  deviceTypeCode: '',	 // String	是	设备类型编码
  defectTypeCode: '',	 // String	是	缺陷类型编码
  sort:'',	           // String	是	排序字段，排序方式（缺陷级别：0、电站名称:1、设备名称:2、缺陷类型:3、创建时间:4、截止时间:5、完成时间:6、处理进度:7），格式：排序字段，排序方式（0：升序，1：降序）
  selfDefect: false,   // boolean 默认所有人的(->不仅仅我参与的)缺陷

  defectList:[],//渲染为table的缺陷列表
  commonList:[],//获取缺陷常用语列表
  selectedRowKeys: [],
  defectStatusStatistics:{
    submitNum: 0,
    examineNum: 0,
    executeNum: 0,
    checkNum: 0,
  },
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
    photoAddress: '',
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
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case TicketAction.CHANGE_DEFECT_STORE :
      return state.merge(immutable.fromJS(action.payload))
    case TicketAction.GET_DEFECT_COMMON_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case TicketAction.TICKET_FETCH:
      return state.set('isfetching', true);
    // case TicketAction.GET_DEFECT_LIST_SUCCESS:  
    //   return state.set('isFetching', false)
    //               .set('total', action.data.total)
    //               .set('defectList', immutable.fromJS(action.data.defectList))
    //               .set('selectedRowKeys', immutable.fromJS([]))
    //               .set('defectStatusStatistics', immutable.fromJS(action.data.defectStatusStatistics))
    //               .set('pageNum', (action.params.pageNum + 1))
    //               .set('pageSize', action.params.pageSize)
    //               .set('status', action.params.status)
    //               .set('sort', action.params.sort);
    case TicketAction.SET_DEFECT_ID:
      return state.set('defectId', action.data);
    case TicketAction.SET_SELECTED_DEFECT:
      return state.set('selectedRowKeys', immutable.fromJS(action.data));
    case TicketAction.CLEAR_DEFECT_STATE:
      return initState;
    case TicketAction.GET_DEFECT_DETAIL_SUCCESS: 
      return state.set('isFetching', false)
                  .set('defectDetail', immutable.fromJS(action.data))
                  .set('defectId', action.params.defectId);
    case TicketAction.GET_DEFECT_LANGUAGE_SUCCESS: 
      return state.set('isFetching', false)
                  .set('commonList', immutable.fromJS(action.data));
    case TicketAction.GET_DEFECTTYPES_SAGA_SUCCESS:
      return state.set('isFetching', false)
                  .set('defectTypes', immutable.fromJS(action.params.data));
    case TicketAction.GET_DEFECT_LIST_FAIL:
    case TicketAction.GET_DEFECT_DETAIL_FAIL:
    case TicketAction.GET_DEFECT_LANGUAGE_FAIL:
    case TicketAction.GET_DEFECTTYPES_SAGA_FAIL:
    case TicketAction.DEFECT_CREATE_FAIL:
      return state.set('error', immutable.fromJS(action.error));
  }

  return state;
}


export default defectReducer;