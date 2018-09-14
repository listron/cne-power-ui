import Immutable from 'immutable';

import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModelCode: null, // 选中的设备型号
  pointCode: '', // 选中的测点code
  pageNum: 1,
  pageSize: 10,
  sortField: '', // 排序字段
  sortOrder: '',

  totalNum:  0, // 告警事件总数
  alarmList: [], // 设备列表
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