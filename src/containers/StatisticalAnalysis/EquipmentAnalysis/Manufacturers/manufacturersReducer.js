import Immutable from 'immutable';
import { manufacturersAction } from './manufacturersAction';
import moment from 'moment';

const currentYearDay = '2018-01-01';
const endDates = moment().format('YYYY-MM-DD');
var initState = Immutable.fromJS({
  manufacturerList: [],
  devicemodeList: [],
  stationCode: [], // 电站编码
  startDate: '', // 开始时间
  endDate: '',// 结束时间
  deviceTypeCode: '206',// 设备类型编码 默认是逆变器
  // manufacturerMode: 'manufacturer',//  厂家型号 默认是厂家
  manufacturerMode: '',//  厂家型号 默认是厂家
  manufacturerModes: [],//
  deviceData:[],
});


const ManufacturersReducer = (state = initState, action) => {
  switch (action.type) {
    case manufacturersAction.changeManufacturersStore:
      return state.merge(Immutable.fromJS(action.payload))
    case manufacturersAction.RESET_STORE:
      return initState
  }
  return state;
}

export default ManufacturersReducer;