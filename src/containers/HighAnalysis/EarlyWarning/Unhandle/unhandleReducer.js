import Immutable from 'immutable';
import { unhandleAction } from './unhandleAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCodes: [], // 选中的电站
  belongMatrixs:[],//所属方阵
  inefficiencyStatus:0, // 0待处理预警，5历史预警
  startTime:'', // 查询时段起点
  endTime:'',//询时段结点
  pageNum: 1,
  pageSize: 10,
  totalNum:null,
  sortField: 'station_code', // 排序字段
  sortMethod: 'asc', //asc /desc
  unhandleList:[], //  预警列表
  warnDetail:{},//预警信息
  Sequencechart:{} // 时序图 
});

const UnhandleReducer = (state = initState, action) => {
  switch (action.type) {
    case unhandleAction.unhadleFetch:
      return state.set('loading',true)
    case unhandleAction.getUnhandleFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case unhandleAction.changeUnhandleStore:
      return state.merge(Immutable.fromJS(action.payload))
    case unhandleAction.RESET_STORE:
      return initState
  }
  return state;
}

export default UnhandleReducer;