import Immutable from 'immutable';

import { deviceManageAction } from './deviceManageAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  pageNum: 1,
  pageSize: 10,
  totalNum:  0, // 设备总数
  sortField: '', // 排序字段
  sortMethod: '', // 排序方式('0':正序,'1': 倒序)
  
  deviceList: [], // 设备列表
  stationDeviceTypes: [], //电站下设备类型
  deviceModels: [], // 电站设备类型下设备型号
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