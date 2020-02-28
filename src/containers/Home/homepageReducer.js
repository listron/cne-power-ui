import Immutable from 'immutable';
import { homepageAction } from './homepageAction';

const initState = Immutable.fromJS({
  loading: false,
  realTimeInfo: {}, // 实时监控10s数据组
  completeRate: {}, // 完成率
  energySaving: {}, // 节能减排
  monthPower: [], // 月发电量
  eqpHour: {}, // 等效利用小时数
  faultNumber: [], // 故障台次
  alarmList: [], // 告警列表 
  operationInfo: {}, // 运维情况
  mapStation: [], // 地图各坐标情况
  mapStationTimer: null, // 地图坐标情况时刻记录
  outputPower: [], // 出力图
  singleStation: {}, // 单电站效果
  outputPowerTime: '', // 记录风电站出力图数据请求时间=>用于对比是否需要刷新chart图。
  faultQueryTime: '', // 记录故障台次请求时间已判断是否刷新chart图
  alarmeQueryTime: '', // 记录告警时间以此判定是否刷新chart图
  inefficientList: [], // 待处理预警
});

const homepageReducer = (state = initState, action) => {
  switch (action.type) {
    case homepageAction.LOADING:
      return state.set('loading', true);
    case homepageAction.GET_HOMEPAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case homepageAction.changeHomepageStore:
      return state.merge(Immutable.fromJS(action.payload));
    case homepageAction.homepageReset:
      return initState;
  }
  return state;
};

export default homepageReducer;
