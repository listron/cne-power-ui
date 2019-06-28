import immutable from 'immutable';
import moment from 'moment';
import { dataExportAction } from './dataExportAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  selectStationType: null, // 选中的电站类型
  stationDeviceTypes: [], // 电站下可选设备类型
  intervalInfo: [10,5], // 默认支持的时间间隔5s,10min
  reRenderTree: null, // 记录属性控件生成时间
  pointInfo: [], // 选中设备内可选测点信息
  partDataExport: {}, // 表格内 - 分页后的历史数据
  // status: null, // 1生成中；2已生成；3失败

  pointsSeleted: [], // 确认时候 => 选中的测点
  
  // devicePointCodes: [], // 设备测点数组
  duration: '', // 时间段
  taskId: '', // 行id
  deviceTypeCode: null, // 选中的设备类型
  queryParams: {
    timeZone:  moment().zone() / (-60), // 时区
    dataTypes: [], // 数据类型(1：平均值（差值），2：最大值（结束值）3：最小值（开始值） 4：瞬时值)
    stationCode: null, // 选中的电站
    deviceFullCodes: [], // 选中的设备
    devicePointCodes: [], // 选中的测点
    timeInterval: 10, // 数据时间间隔：1-1s,5-5s,10-10min
    startTime: moment().subtract(1, 'month').startOf('day'),
    endTime: moment().subtract(1, 'month').endOf('day'),
  },
  listParam: {
    pageNum: 1, // 当前页码（从1开始）
    pageSize: 10 // 每页条数
  }
})

const dataExport = (state = initState, action) => {
  switch (action.type) {
    case dataExportAction.GET_DATAEXPORT_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case dataExportAction.changeDataExportStore:
      return state.merge(immutable.fromJS(action.payload));
    case dataExportAction.resetStore:
      return initState;
  }
  return state;
}

export default dataExport;