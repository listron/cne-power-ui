import Immutable from 'immutable';

import { pointManageAction } from '../../../../constants/actionTypes/system/station/pointManageAction';

var initState = Immutable.fromJS({
  loading: false,
  testWords: '测点管理页面的-----测试数据',
});

const pointManageReducer = (state = initState, action) => {
  switch (action.type) {
    case pointManageAction.POINT_MANAGE_FETCH:
      return state.set('loading',true)
    case pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case pointManageAction.CHANGE_POINT_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}

export default pointManageReducer;