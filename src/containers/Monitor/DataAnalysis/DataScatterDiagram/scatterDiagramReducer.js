import Immutable from 'immutable';
import moment from 'moment';
import { scatterDiagramAction } from './scatterDiagramAction';

const initState = Immutable.fromJS({
  loading: false,
  selectStationType: null,// 选中的电站类型
  deviceTypeCode: null, // 选中的设备类型
  stationDeviceTypes: [], // 电站下可选设备类型
  chartTime: null, // 记录chart表的数据时间
  xPointList: [], // x轴测点
  yPointList: [], // y轴测点
  dataList: [], // 列表数据
  tableLoading: false, // 列表请求的loading
  partScatterDiagram: [], // 表格内 - 分页后数据
  queryParam: { // 请求chart数据的参数集合
    stationCode: null, // 选中的电站
    deviceFullCode: [], // 选中的设备
    deviceTypeName: '101',// 设备型号
    devicePointCode: '', // 测点
    startTime: moment().startOf('day').subtract(1, 'day'),
    endTime: moment(),
    xPoint:'',
    yPoint:'',
  },
  listParam: {
    orderField: 'deviceName', // 排序字段(默认时间倒序（最新的时间在最上方）
    orderType: 1, //	排序方式	否	0：ASC正序，1：DESC倒序
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
  },
  scatterDiagramType: 'chart', // 数据展示方式，'chart'图 / 'list'表格
})

const dataScatterDiagram = (state = initState, action) => {
  switch (action.type) {
    case scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload));
    case scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case scatterDiagramAction.RESET_SCATTERDIAGRAM:
      return initState;
  }
  return state;
}

export { scatterDiagramAction, dataScatterDiagram };