import Immutable from 'immutable';

import { powerCurveAction } from './powerCurveAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCode: '', // 选中的电站
  deviceTypeCode: '', // 选中的设备类型
  deviceModeCode: '', // 选中的设备型号
  pageNum: 1,
  pageSize: 10,
  sortField: 'device_mode_name', // 排序字段
  sortMethod: 'asc', //asc /desc
  powerList:[], // 功率曲线的列表
  deviceModels:[],
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
