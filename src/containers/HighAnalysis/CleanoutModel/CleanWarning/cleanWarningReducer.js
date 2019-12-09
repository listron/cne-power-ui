import Immutable from 'immutable';
import moment from 'moment';
import { cleanWarningAction } from './cleanWarningAction';

var initState = Immutable.fromJS({
  loading: false,
  showPage: 'list', //默认 预警列表list, 灰尘影响详情detail,

  listQueryParams: { // 请求列表所用参数
    stationCodes: [], // 选中的电站。默认所有
    pageNum: 1, // 当前页
    pageSize: 10, // 每页条数
    sortField: '', // 排序字段 stationName电站influencePercent占比futurePower未来收益cleanDays距上次清洗天数
    sortType: -1, // 排序方式 ;默认灰尘占比降序排列： 0-升序, 1-降序
  },

  cleanWarningList: [], // api => 清洗预警列表
  total: 0, // api =>  清洗预警总数
  weatherList: [], // api => 选中电站天气数据
  dustEffectInfo: {}, // api => 灰尘影响详情
  totalEffects: [], // api => 全局灰尘影响
  matrixEffects: [], // api => 方阵灰尘影响

  startDay: moment().subtract(1, 'months').add(-1, 'days').format('YYYY-MM-DD'),
  endDay: moment().subtract(1, 'days').format('YYYY-MM-DD'),
});

const cleanWarning = (state = initState, action) => {
  switch (action.type) {
    case cleanWarningAction.CLEAN_WARNING_FETCH:
      return state.set('loading', true);
    case cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case cleanWarningAction.CHANGE_CLEAN_WARNING_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case cleanWarningAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default cleanWarning;
