import Immutable from 'immutable';

import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';

var initState = Immutable.fromJS({
  loading: false,
  testWords: '电站管理管理的-----测试数据-to  remove',
  showPage: 'list',//默认展示列表页list ,   编辑edit,详情detail,
  // 电站类型
  // 电站所属区域
  // 电站名称
  // 当前页
  // 每页条数
  // 排序方式
  // 排序字段
  stationList: [],// 电站列表数据
  totalNum:  0, // 电站总数
  stationDetail: {},// 电站详情
});

const stationManageReducer = (state = initState, action) => {
  switch (action.type) {
    case stationManageAction.STATION_MANAGE_FETCH:
      return state.set('loading',true)
    case stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case stationManageAction.CHANGE_STATION_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}

export default stationManageReducer;