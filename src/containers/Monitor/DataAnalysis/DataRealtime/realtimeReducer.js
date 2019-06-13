import immutable from 'immutable';
import moment from 'moment';

const realtimeAction = {
  getAvailableDeviceType: Symbol('getAvailableDeviceType'), // 获取有测点的设备类型
  getRealtimeChart: Symbol('getRealtimeChart'), // 获取实时图表chart数据
  stopRealtimeChart: Symbol('stopRealtimeChart'), // 停止图表实时
  getRealtimeList: Symbol('getRealtimeList'), // 测点实时数据-表格
  stopRealtimeList: Symbol('stopRealtimeList'), // 停止列表实时
  getPointInfo: Symbol('getPointInfo'), // 根据选中电站/设备得到的可选测点信息
  getSecendInterval: Symbol('getSecendInterval'), // 获取是否有秒级数据。

  GET_REALTIME_SUCCESS: Symbol('GET_REALTIME_SUCCESS'), // 获取api数据成功
  CHANGE_REALTIME_STORE:Symbol('CHANGE_REALTIME_STORE'), // 手动更新当前history数据
  RESET_REALTIME:Symbol('RESET_REALTIME'), // 数据重置
}

const initState = immutable.fromJS({
  selectStationType: 0, // 选中的电站类型
  deviceTypeCode: null, // 选中的设备类型
  dataTime: null, // 记录的最新数据时间
  tableLoading: false, // 列表请求的loading
  chartLoading: false, // chart图表的loading
  downloading: false, // 文件下载状态
  timeInterval: 5, // 实时数据间隔时间,
  reRenderTree: null, // 记录属性控件生成时间
  chartTimeMoment: null, // 记录由后台返回的chart图最新数据刷新时间
  queryParam: { // 请求chart数据的参数集合
    stationCode: null, // 选中的电站
    deviceFullCodes: [], // 选中的设备
    devicePoints: [], // 选中的测点
  },
  listParam: { // 表格排序额外参数
    pageNum: 1, // 当前页码（从1开始）
    pageSize: 10 // 每页条数
  },
  realtimeType: 'chart', // 数据展示方式，'chart'图 / 'list'表格
  
  stationDeviceTypes: [], // 电站下可选设备类型
  pointInfo: [], // 选中设备内可选测点信息。
  chartRealtime: {}, // chart图 - 所有历史数据
  listRealtime: {}, // 表格内 - 分页后的历史数据

  exportTime: null, // 导出的开始时间
});

const dataRealtime = (state = initState, action) => {
  switch (action.type) {
    case realtimeAction.GET_REALTIME_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case realtimeAction.CHANGE_REALTIME_STORE:
      return state.merge(immutable.fromJS(action.payload));
    case realtimeAction.RESET_REALTIME:
      return initState;
  }
  return state;
}

export { realtimeAction, dataRealtime };
