import Immutable from 'immutable';
import { customizeAction } from './customizeAction';

var initState = Immutable.fromJS({
  manufacturerList: [],// 电站下的生产厂商
  anotherManufacturerList: [],// 电站下的生产厂商
  devicemodeList: [],// 电站下生产厂家设备
  anotherDevicemodeList: [],// 电站下生产厂家设备
  stationCode: [],
  manufacturer: '', // 厂家
  deviceTypeCode: '逆变器',
  startDate: '', // 开始时间
  endDate: '', // 结束时间
  deviceModeIds:[],// 设备ID
  detailData:[],//第一个数据
  anotherDetailData:[],//第一个数据
});


const CustomizeReducer = (state = initState, action) => {
  switch (action.type) {
    case customizeAction.changeCustomizeStore:
      return state.merge(Immutable.fromJS(action.payload))
    case customizeAction.RESET_STORE:
      return initState
  }
  return state;
}

export default CustomizeReducer;