import Immutable from 'immutable';
import { manufacturersAction } from './manufacturersAction';
import moment from 'moment';

const startDate = moment().year() + '-01-01';
const endDate = moment().format('YYYY-MM-DD');
var initState = Immutable.fromJS({
  manufacturerList: [],
  devicemodeList: [],
  stationCode: [], // 电站编码
  startDate: startDate, // 开始时间
  endDate: endDate,// 结束时间
  deviceData: [],
  deviceTypeNameLike: '逆变器',// 设备类型 默认是逆变器
  manufacturers: [], // 厂家
  deviceModeIds: [], // 设备型号
  selectOption:[], // 按型号 还是 按厂家 "manufacturer"   "deviceMode" 
  conversioneffList: [], // 转换效率
  faultNumList: [], //故障次数
  faultHoursList: [], // 故障时长
  deviceCapacityList: [] //装机容量
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