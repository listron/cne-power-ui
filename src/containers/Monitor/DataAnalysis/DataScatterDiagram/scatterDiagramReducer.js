import Immutable from 'immutable';
import moment from 'moment';
import { scatterDiagramAction } from './scatterDiagramAction';

const initState = Immutable.fromJS({
  loading: false,
  selectStationType: null,// 选中的电站类型
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  stationDeviceTypes : [],// 电站下可选设备类型
  queryParam: { // 请求chart数据的参数集合
    stationCode: null, // 选中的电站
    deviceFullCode: [], // 选中的设备
    startTime: moment().startOf('day').subtract(1, 'day'),
    endTime: moment(),
    devicePoint: [], // 选中的测点
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