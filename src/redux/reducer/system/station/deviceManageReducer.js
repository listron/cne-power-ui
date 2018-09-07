import Immutable from 'immutable';

import { deviceManageAction } from '../../../../constants/actionTypes/system/station/deviceManageAction';

var initState = Immutable.fromJS({
  loading: false,
  testWords: 'shebei device管理管理的-----测试数据',
});

const deviceManageReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceManageAction.DEVICE_MANAGE_FETCH:
      return state.set('loading',true)
    case deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case deviceManageAction.CHANGE_DEVICE_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}

export default deviceManageReducer;