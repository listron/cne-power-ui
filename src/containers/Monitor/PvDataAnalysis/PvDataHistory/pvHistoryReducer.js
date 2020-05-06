import Immutable from 'immutable';
import moment from 'moment';

const pvHistoryAction = {
  getAvailableDeviceType: Symbol('getAvailableDeviceType'), // 获取有测点的设备类型
  getChartHistory: Symbol('getChartHistory'), // 获取时间段内图表chart历史数据
  getListHistory: Symbol('getListHistory'), // 表格历史数据
  getPointInfo: Symbol('getPointInfo'), // 根据选中电站/设备得到的可选测点信息
  getSecendInterval: Symbol('getSecendInterval'), // 获取是否有秒级数据。

  GET_HISTORY_SUCCESS: Symbol('GET_HISTORY_SUCCESS'), // 获取api数据成功
  CHANGE_HISTORY_STORE: Symbol('CHANGE_HISTORY_STORE'), // 手动更新当前history数据
  RESET_HISTORY: Symbol('RESET_HISTORY'), // 数据重置
};

const initState = Immutable.fromJS({
  selectStationType: 1, // 选中的电站类型
  deviceTypeCode: null, // 选中的设备类型
  tableLoading: false, // 列表请求的loading
  chartLoading: false, // chart图表的loading
  downloading: false, // 文件下载状态
  chartTime: null, // 记录chart表的数据时间
  reRenderTree: null, // 记录属性控件生成时间
  filterDevices: [], // 所有设备数据
  queryParam: { // 请求chart数据的参数集合
    stationCode: null, // 选中的电站
    deviceFullCodes: [], // 选中的设备
    startTime: moment().startOf('day'),
    endTime: moment(),
    devicePoints: [], // 选中的测点
    timeInterval: 10, // 数据时间间隔:1-1s, 5-5s, 10-10min, 2-1min;
  },
  listParam: { // 表格排序额外参数
    orderField: 'deviceName', // 排序字段(默认时间倒序（最新的时间在最上方）
    orderType: 1, //	排序方式	否	0：ASC正序，1：DESC倒序
    pageNum: 1, // 当前页码（从1开始）
    pageSize: 10, // 每页条数
  },
  historyType: 'chart', // 数据展示方式，'chart'图 / 'list'表格
  recordedMinuteStart: moment().startOf('day'), // 记录10min起始时间
  recordedMinuteEnd: moment(), // 记录10min终止时间

  stationDeviceTypes: [], // 电站下可选设备类型
  intervalInfo: [10, 2, 5], // 默认支持的时间间隔 5s, 10min, 1min
  pointInfo: [], // 选中设备内可选测点信息。
  allHistory: {}, // chart图 - 所有历史数据
  partHistory: {}, // 表格内 - 分页后的历史数据
  logPoint: null, // 请求时暂存的测点数据
  isNoDataTip: false, // 诊断中心传来的值无数据时弹出提示语
});

const pvDataHistory = (state = initState, action) => {
  switch (action.type) {
    case pvHistoryAction.GET_HISTORY_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload));
    case pvHistoryAction.CHANGE_HISTORY_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case pvHistoryAction.RESET_HISTORY:
      return initState;
  }
  return state;
};

export { pvHistoryAction, pvDataHistory };
