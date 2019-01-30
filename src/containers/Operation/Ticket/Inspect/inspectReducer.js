import Immutable from 'immutable';
import { ticketAction } from '../ticketAction';


var initState = Immutable.fromJS({
  inspectList:[],
  inspectIdList:[],
  selectedRowKeys: [],
  stationType: '2',    //	电站类型(0:风电，1光伏，2：全部)
  stationCodes: '',    // 电站编码，所有为空字符串
  timeInterval: '0',   //	String	是	时间段（0：全部，1：今天，2：近三天，3：一周内，4：一个月）app参数，web写死全部
  status:'5',          //	String	是	工单状态代码状态（0：待提交:1：待审核、2：执行中、3：待验收、4：已完成、5：所有）
  pageNum: 1,          //	Int	否	页号
  pageSize: 10,        //	Int	否	每页记录数
  createTimeStart: '', //	String	是	创建时间（开始）
  createTimeEnd: '',	 // String	是	创建时间（结束）
  deviceTypeCode: '',	 // String	是	设备类型编码
  sort:'',	           // String	是	排序字段，排序方式（缺陷级别：0、电站名称:1、设备名称:2、缺陷类型:3、创建时间:4、截止时间:5、完成时间:6、处理进度:7），格式：排序字段，排序方式（0：升序，1：降序）
  hasAbnormal: false,  // boolean 默认所有(=>不仅仅是异常)
  handleUser: '',     // 处理人
  
  loading: false,
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
  defectTypes: [],
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
  deviceTypeItems: [], // 电站下的设备类型
  devices: [], // 设备列表
  partitions: [], // 方阵列表
  startDate:'',//巡检开始时间 inspectId, startDate, endDate, pageNum, pageSize,userId,inspectStatus,deviceTypeCode,sortType
  endDate:'',//巡检结束时间
  allSeries: [], // 所有光伏组件
  firstPartitionCode: null,
  inspectUsers:[],//巡检用户列表
  userId:'',//巡检人id
  //stationDeviceTypes:'',//某电站下的设备类型
  inspectStatus:null,//巡检状态
  deviceTypeCode:'',//设备类型Id
  inspectDetailRecord:[],//巡检记录详情数据
  sortType:0,//0是正序1是倒序
  totalCount:0,//巡检记录列表的数据个数
  inspectUserData:[],//巡检轨迹的人员
  inspectTrackData:[],//巡检轨迹的数据坐标
});

const inspectReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.TICKET_FETCH:
      return state.set('loading', true);
    case ticketAction.CHANGE_INSPECT_STORE :
      return state.merge(Immutable.fromJS(action.payload));
    case ticketAction.GET_INSPECT_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case ticketAction.SET_DEFECT_FAIL:
      return state.set('error', Immutable.fromJS(action.error));
    case ticketAction.CLEAR_INSPECT_STATE:
      return initState;
  }
  return state;
}


export default inspectReducer;