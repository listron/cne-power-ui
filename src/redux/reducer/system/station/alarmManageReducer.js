import Immutable from 'immutable';

import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';

var initState = Immutable.fromJS({
  loading: false,
  testWords: '告警事件管理的-----测试数据',
});

const alarmManageReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmManageAction.ALARM_MANAGE_FETCH:
      return state.set('loading',true)
    case alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case alarmManageAction.CHANGE_ALARM_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}

export default alarmManageReducer;