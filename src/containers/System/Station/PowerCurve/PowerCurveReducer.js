import Immutable from 'immutable';

import { powerCurveAction } from './PowerCurveAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  pageNum: 1,
  pageSize: 10,
  sortField: '', // 排序字段
  sortOrder: '',
});

const powerCurveReducer = (state = initState, action) => {
  switch (action.type) {
    case powerCurveAction.powerCurveFetch:
      return state.set('loading',true)
    case powerCurveAction.powerCurveFetchSuccess :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case powerCurveAction.changePowerCurveStore:
      return state.merge(Immutable.fromJS(action.payload))
    case powerCurveAction.resetStore:
      return initState
  }
  return state;
}

export default powerCurveReducer;
