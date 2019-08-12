import immutable from 'immutable';
import moment from 'moment';
import { dailyQueryAction } from './dailyQueryAction';

 const initState = immutable.fromJS({
  selectStationType: 0, // 选中的电站类型
  queryParam: { // 请求数据的集合
    stationCode: null, // 选中的电站
  }
 });

 const dailyQueryReducer = (state = initState, action) => {
  switch (action.type) {
    case dailyQueryAction.GET_DAILYQUERY_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case dailyQueryAction.changeDailyQueryStore:
      return state.merge(immutable.fromJS(action.payload));
    case dailyQueryAction.resetStore:
      return initState;
  }
  return state;
};

export default dailyQueryReducer;
