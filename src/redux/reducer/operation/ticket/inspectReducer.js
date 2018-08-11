import immutable from 'immutable';
import { ticketAction } from '../../../../constants/actionTypes/operation/ticketAction';


var initState = immutable.fromJS({
  inspectList:[],

  stationType: '2',    //	电站类型(0:风电，1光伏，2：全部)
  stationCodes: '',    // 电站编码，所有为空字符串
  timeInterval: '0',   //	String	是	时间段（0：全部，1：今天，2：近三天，3：一周内，4：一个月）
  status:'5',          //	String	是	工单状态代码状态（0：待提交:1：待审核、2：执行中、3：待验收、4：已完成、5：所有）
  pageNum: 1,          //	Int	否	页号
  pageSize: 10,        //	Int	否	每页记录数
  createTimeStart: '', //	String	是	创建时间（开始）
  createTimeEnd: '',	 // String	是	创建时间（结束）
  deviceTypeCode: '',	 // String	是	设备类型编码
  sort:'',	           // String	是	排序字段，排序方式（缺陷级别：0、电站名称:1、设备名称:2、缺陷类型:3、创建时间:4、截止时间:5、完成时间:6、处理进度:7），格式：排序字段，排序方式（0：升序，1：降序）
  hasAbnormal: false,  // boolean 默认所有(=>不仅仅是异常)
  selfDefect: false,   // boolean 默认所有人的(->不只是我参与的)缺陷
  
  isFetching: false,
  error: {
    code: '',
    message: ''
  },
  total: 0,
  inspectStatusStatistics: {
    checkNum: 0,
    executeNum: 0
  },
  inspectId: '',
  inspectDetail: {//巡检详情
    inspectId: '',
    stationCode: '',
    stationName: '',
    stationType: '',
    inspectName: '',
    createTime: '',
    deadLine: '',
    abnormalData: [],
    processData:[],
    inspectStatus: '',
    deviceTypeNames: '',
    abnormalIsShow: false,
  },
  inspectStandard: [],
});

const inspectReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.TICKET_FETCH:
      return state.set('isFetching', true);
    case ticketAction.CHANGE_INSPECT_STORE :
      return state.merge(immutable.fromJS(action.payload))
    case ticketAction.GET_INSPECT_COMMON_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case ticketAction.CLEAR_INSPECT_STATE:
      return initState;
    // case ticketAction.GET_INSPECT_LIST_SUCCESS:
    //   return state.set('isFetching', false)
    //               .set('inspectList', immutable.fromJS(action.data.inspectList))
    //               .set('pageNum', action.params.pageNum + 1)
    //               .set('pageSize', action.params.pageSize)
    //               .set('total', action.data.total)
    //               .set('status', action.params.status)
    //               .set('inspectStatusStatistics', immutable.fromJS(action.data.inspectStatusStatistics))
    //               .set('sort', action.params.sort);
    case ticketAction.SET_INSPECT_ID:
      return state.set('inspectId', action.data);
    case ticketAction.GET_INSPECT_DETAIL_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectDetail', immutable.fromJS(action.data))
                  .set('inspectId', action.params.inspectId);
    case ticketAction.GET_INSPECT_STANDARD_SUCCESS:
      return state.set('isFetching', false)
                  .set('inspectStandard', immutable.fromJS(action.data.data));
    case ticketAction.GET_INSPECT_LIST_FAIL:
    case ticketAction.GET_INSPECT_DETAIL_FAIL:
    case ticketAction.ADD_INSPECT_ABNORMAL_FAIL:
    case ticketAction.TRANSFORM_DEFECT_FAIL:
    case ticketAction.SET_INSPECT_CHECK_FAIL:
    case ticketAction.FINISH_INSPECT_FAIL:
    case ticketAction.CREATE_INSPECT_FAIL:
    case ticketAction.GET_INSPECT_STANDARD_FAIL:
      return state.set('error', immutable.fromJS(action.error));
  }
  return state;
}


export default inspectReducer;