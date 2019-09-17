import Immutable from 'immutable';
import { ignoreAction } from './ignoreAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCodes: [], // 选中的电站
  belongMatrixs: [],//所属方阵
  startTime: '', // 查询时段起点
  endTime: '',//询时段结点
  pageNum: 1,
  pageSize: 10,
  totalNum: null,
  sortField: 'ignore_time', // 排序字段
  sortMethod: 'desc', //asc /desc
  ignoreList: [], //  忽略列表
  matrixList: [] // 电站下方阵列表

});

const IgnoreReducer = (state = initState, action) => {
  switch (action.type) {
    case ignoreAction.ignoreFetch:
      return state.set('loading', true)
    case ignoreAction.getIgnoreFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
    case ignoreAction.changeIgnoreStore:
      return state.merge(Immutable.fromJS(action.payload))
    case ignoreAction.RESET_STORE:
      return initState
  }
  return state;
}

export default IgnoreReducer;