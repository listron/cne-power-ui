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
  outputPower: [], // 出力图
});

const homepageReducer = (state = initState, action) => {
  switch (action.type) {
    case homepageAction.LOADING:
      return state.set('loading',true)
    case homepageAction.GET_HOMEPAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case homepageAction.changeHomepageStore:
      return state.merge(Immutable.fromJS(action.payload))
    case homepageAction.homepageReset:
      return initState
  }
  return state;
}

export default homepageReducer;