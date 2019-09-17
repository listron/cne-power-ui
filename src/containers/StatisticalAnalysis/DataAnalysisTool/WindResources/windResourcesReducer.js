import Immutable from 'immutable';
import moment from 'moment';
import { windResourcesAction } from './windResourcesAction';

var initState = Immutable.fromJS({
  bigchartLoading: false,
  chartLoading: false,
  startTime: moment().startOf('year').format(),
  endTime: moment().format(),
  chartTime: null,
  deviceList: [], // 电站下的设备
  frequencyData: [], // 频率图数据
  curBigChartData: [], // 放大频率图数据
  activeCode: '',
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
