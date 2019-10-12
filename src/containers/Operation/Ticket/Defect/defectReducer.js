import Immutable from 'immutable';
import { ticketAction } from '../ticketAction';

var initState = Immutable.fromJS({
  loading: false,
  error: {
    code: '',
    message: '',
  },
  stationType: '', //	电站类型(0:风电，1光伏，2：全部)
  stationCodes: [], // 电站编码，所有为空字符串
  defectSource: [], // string  ''：全部，0：告警，1：手动，2：巡检, app需要，web写死是全部
  defectLevel: [], // String	是	缺陷级别（0：全部，1：一级，2：二级，3：三级，4：四级） ''全部
  timeInterval: '', //	String	是	时间段（0：全部，1：今天，2：近三天，3：一周内，4：一个月）app参数，web写死全部
  status: '', //	String	是	工单状态代码状态（0：待提交:1：待审核、2：执行中、3：待验收、4：已完成、5：所有）
  pageNum: 1, //	Int	否	页号
  pageSize: 10, //	Int	否	每页记录数
  createTimeStart: '', //	String	是	创建时间（开始）
  createTimeEnd: '',	 // String	是	创建时间（结束）
  deviceTypeCode: [],	 // String	是	设备类型编码
  defectTypeCode: [],	 // String	是	缺陷类型编码
  sortField: 'create_time',
  sortMethod: 'desc ',
  handleUser: '', //处理人
  deviceTypes: [], // 电站下设备类型
  handleUserList: [], // 选中的属于participantList的参与人列表

  defectList: [], //渲染为table的缺陷列表
  participantList: [], // 搜索区参与人列表
  defectIdList: [], //所有巡检Id
  commonList: [], //获取缺陷常用语列表
  selectedRowKeys: [],
  defectStatusStatistics: {
    submitNum: 0,
    examineNum: 0,
    executeNum: 0,
    checkNum: 0,
  },
  total: 0,
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
      status: '1',
    },
    processData: [],
  },
  defectTypes: [],
  devices: [], // 设备列表
  partitions: [], // 设备列表
  allSeries: [], // 所有光伏组件
  firstPartitionCode: null,
  knowledgebaseList: [], // 专家库列表
  knowledgebasePramas: {
    deviceTypeCodes: [], // 专家库设备code
    faultTypeIds: [], // 专家库缺陷ID
  },
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.TICKET_FETCH:
      return state.set('loading', true);
    case ticketAction.CHANGE_DEFECT_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case ticketAction.GET_DEFECT_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case ticketAction.SET_DEFECT_FAIL:
      return state.set('error', Immutable.fromJS(action.error)).set('loading', false);
    case ticketAction.CLEAR_DEFECT_STATE:
      return initState;
  }

  return state;
};


export default defectReducer;
