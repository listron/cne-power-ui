import Immutable from 'immutable';
import { workOrderAction } from './workOrderAction';

var initState = Immutable.fromJS({
  loading: false,
  commonList: [],//缺陷常用语
  defectDetail: {//缺陷详情
    // defectId: '',  //缺陷ID
    stationName: '', // 电站名称
    deviceName: '', // 设备名称
    defectTypeName: '', // 缺陷类名
    defectLevel: 1,  // 缺陷级别
    defectDescribe: '',// 缺陷描述
    defectStatus: '',// 缺陷状态
    photoAddress: '',// 照片信息列表(存储地址，逗号隔开)
    processData: [],
    handleData: {
      defectProposal: '',
      defectSolveInfo: '',
      replaceParts: '',
      defectSolveResult: 0,
      status: ''
    },
  },
  callBack:false, // 是否返回上一页面
  stationType:'',//电站类型
  defectSource:'',//缺陷来源
  modify:false, // 是否进行了修改
  knowledgebaseList:[],// 专家库列表
});





const workOrderReducer = (state = initState, action) => {
  switch (action.type) {
    case workOrderAction.workOrderFetch:
      return state.set('loading', true)
    case workOrderAction.getworkOrderFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
    case workOrderAction.changeWorkOrderStore:
      return state.merge(Immutable.fromJS(action.payload))
    case workOrderAction.RESET_STORE:
      return initState
  }
  return state;
}

export default workOrderReducer;