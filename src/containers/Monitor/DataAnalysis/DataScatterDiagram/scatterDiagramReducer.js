import Immutable from 'immutable';
import moment from 'moment';
import { scatterDiagramAction } from './scatterDiagramAction';

const initState = Immutable.fromJS({
  loading: false,
  selectStationType: null,// 选中的电站类型
  stationType: "", // 风-0，光-1
  stationCode: null, // 选中的电站
  deviceTypeCode: '', // 选中的设备类型
  chartTime: null, // 记录chart表的数据时间
  allScatterData: {}, //所有的chart时间数据
  queryParam: { // 请求chart数据的参数集合
    stationCode: null, // 选中的电站
    deviceFullCode: [], // 选中的设备
    deviceTypeName: '101',// 设备型号
    startTime: moment().startOf('day').subtract(1, 'day'),
    endTime: moment(),
    xPoint: [], // 选中的x测点
    yPoint: [], // 选中的y测点
  },
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