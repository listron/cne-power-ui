import Immutable from 'immutable';
import { meterReadSetAction } from './meterReadSetAction';

const initState = Immutable.fromJS({
  tableLoading: false, // 进入主页面后loading
  meterListError: false, // 表格data error
  showPage: 'allStation', // allStation展示全部电站，singleStation显示单个电站
  stationCode: '',
  meterListData: [], // 抄表设置列表
});

const meterReadSetReducer = (state = initState, action) => {
  switch(action.type){
    case meterReadSetAction.changeMeterReadSetStore:
      return state.merge(Immutable.fromJS(action.payload));
    case meterReadSetAction.resetStore:
      return initState;
  }
  return state;
};

export default meterReadSetReducer;
