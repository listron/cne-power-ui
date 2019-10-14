import immutable from 'immutable';
import { reportStationAction } from './reportStationAction';
const initState = immutable.fromJS({
  loading: false,
  pageSize: 10,
  pageNum: 0,
  total: 0,
  stationCodes: [],
  type: '1',
  startTime: '',
  endTime: '',
  orderFiled: '',//电站名称：station_name 统计时间：report_time
  orderType: '',//"asc"：正序 "desc"：倒序
  reportStationList: []
});
const reportStationReducer = (state = initState, action) => {
  switch (action.type) {
    case reportStationAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case reportStationAction.resetStore:
      return initState;
  }
  return state;
};

export default reportStationReducer;