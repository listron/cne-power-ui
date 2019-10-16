import Immutable from 'immutable';
import moment from 'moment';
import { windResourcesAction } from './windResourcesAction';

var initState = Immutable.fromJS({
  bigchartLoading: false,
  bigWindRoseLoading: false,
  chartLoading: false,
  directionsLoading: false,
  startTime: moment().subtract(1, 'months').startOf('month').format(),
  endTime: moment().format(),
  deviceList: [], // 电站下的设备
  frequencyData: [], // 频率图数据
  directionsData: [], // 玫瑰图数据
  curBigChartData: [], // 放大频率图数据
  bigWindRoseData: [], // 放大玫瑰图数据
  frequencyMaxData: {
    eneryFrequency: 0,
    speedFrequency: 0,
    windSpeedConfId: 0,
  }, // 频率图的最大值
  activeCode: '',
  directionsCode: '',
  stationCode: '',
  showPage: 'allStation', // allStation显示全部电站，singleStation,显示单电站
  down: false,
  isClick: false,
  activeKey: 1, // tabs
});
const windResourcesReducer = (state = initState, action) => {
  switch (action.type) {
    case windResourcesAction.GET_WINDRESOURCES_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload));
    case windResourcesAction.changeWindResourcesStore:
      return state.merge(Immutable.fromJS(action.payload));
    case windResourcesAction.resetStore:
      return initState;
  }
  return state;
};
export default windResourcesReducer;
