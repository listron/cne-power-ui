import Immutable from 'immutable';
import { transferAction } from './transferAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCodes: [], // 选中的电站
  belongMatrixs: [], //所属方阵
  startTime: '', // 查询时段起点
  endTime: '', //询时段结点
  pageNum: 1,
  pageSize: 10,
  totalNum: null,
  sortField: 'create_time', // 排序字段
  sortMethod: 'desc', //asc /desc
  transferList: [], //  忽略列表
  matrixList: [], // 电站下方阵列表
  defectId: '', //缺陷ID
  pageName: 'list', // 默认是列表页
});


const transferReducer = (state = initState, action) => {
  switch (action.type) {
    case transferAction.transferFetch:
      return state.set('loading', true);
    case transferAction.getTransferFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case transferAction.changeTransferStore:
      return state.merge(Immutable.fromJS(action.payload));
    case transferAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default transferReducer;
