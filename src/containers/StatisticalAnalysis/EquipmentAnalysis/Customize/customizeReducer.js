import Immutable from 'immutable';
import { customizeAction } from './customizeAction';
import moment from 'moment';
const startDate = moment(moment()).startOf('month').format('YYYY-MM-DD');
const endDate = moment(moment()).endOf('month').format('YYYY-MM-DD');
var initState = Immutable.fromJS({
  manufacturerList: [],// 电站下的生产厂商
  anotherManufacturerList: [],// 电站下的生产厂商
  devicemodeList: [],// 电站下生产厂家设备
  anotherDevicemodeList: [],// 电站下生产厂家设备
  stationCode: null,
  anotherStationCode: null,
  manufacturer: '', // 厂家
  anotherManufacturer: '',// 对比的厂家
  deviceModeId: '',// 设备ID
  anotherDeviceModeId: '', // 对比的设备
  deviceTypeNameLike: '逆变器',
  startDate: startDate, // 开始时间
  endDate: endDate, // 结束时间

  detailData: {},//第一个数据
  anotherDetailData: {},//第一个数据
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