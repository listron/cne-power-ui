import Immutable from 'immutable';
import { transferFormAction } from './transferFormAction.js';

var initState = Immutable.fromJS({
  warningStatus: '3', //已转工单
  warningType: '事件告警', //事件告警
  pageName: 'list',
  stationType: '2',
  loading: false,
  warningTypeStatus: '3', //已转工单
  orderField: '1',
  orderCommand: '2',
  durationType: null,
  warningLevel: [], //告警级别多个
  deviceTypeCode: [], //设备类型多个
  rangTime: [], //时间
  // startTime:'',//开始时间
  // endTime:'',//结束时间
  deviceName: null, //设备名称
  pageSize: 10,
  pageNum: 1,
  total: 0,
  ticketInfo: {},
  currentPage: 1,
  stationCodes: [], //电站编码
  oneWarningNum: '--', //一级告警
  twoWarningNum: '--', //二级告警
  threeWarningNum: '--', //三级告警
  fourWarningNum: '--', //四级告警
  transferFormList: [], //实时预警的列表
  selectedRowKeys: [], //表格选中的行key
  defectTypes: [],
  defectId: '',
});
const transferFormReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case transferFormAction.changeTransferFormStore:
      return state.merge(Immutable.fromJS(action.payload));
    case transferFormAction.resetTransferFormStore:
      return initState;
  }
  return state;
};
export default transferFormReducer;
