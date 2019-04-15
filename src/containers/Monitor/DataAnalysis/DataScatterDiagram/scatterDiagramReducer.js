import immutable from 'immutable';
import moment from 'moment';

const scatterDiagramAction = {
  GET_SCATTERDIAGRAM_SUCCESS: Symbol('GET_SCATTERDIAGRAM_SUCCESS'), // 获取api数据成功
  CHANGE_SCATTERDIAGRAM_STORE: Symbol('CHANGE_SCATTERDIAGRAM_STORE'), // 获取散点图数据
  RESETS_SCATTERDIAGRAM_STORE:Symbol('RESETS_SCATTERDIAGRAM_STORE'), // 数据重置
  getPoints:Symbol('getPoints'), // 获取测点数据
  getChartScatterDiagram:Symbol('getChartScatterDiagram'), // 获取chart数据
  getListScatterDiagram:Symbol('getListScatterDiagram'), // 获取list数据
}

const initState = immutable.fromJS({
  chartTime: null, // 记录chart表的数据时间
  tableLoading: false, // 列表请求的loading
  chartLoading: false, // 图表请求的loading
  scatterDiagramType: 'chart', // 数据展示方式，'chart'图 / 'list'表格
  queryParam: { // 请求chart数据的参数集合
    stationCode: [], // 选中的电站
    deviceFullCode: [], // 选中的设备
    startTime: moment().startOf('day').subtract(0, 'day'),
    endTime: moment(),
    xPoint: null,
    yPoint: null,
  },
  listParam: {
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
  },
  logPointX: null, // 请求时暂存的测点数据
  logPointY: null, // 请求时暂存的测点数据
  scatterDiagramCharts: [], // 所有散点图chart数据
  scatterDiagramList: {}, // 散点图表格
  pointsInfo: [],
})

const dataScatterDiagram = (state = initState, action) => {
  switch (action.type) {
    case scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE:
      return state.merge(immutable.fromJS(action.payload));
    case scatterDiagramAction.RESETS_SCATTERDIAGRAM_STORE:
      return initState;
  }
  return state;
}

export { scatterDiagramAction, dataScatterDiagram };