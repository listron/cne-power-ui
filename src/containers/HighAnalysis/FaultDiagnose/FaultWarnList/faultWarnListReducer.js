import Immutable from 'immutable';
import { faultWarnListAction } from './faultWarnListAction.js';

const initState = Immutable.fromJS({
  loading: false,
  viewType: 1, // 展示算法模型1/风机2/列表视图3
  algoModelData: { // 获取单风场故障预警汇总-按模型
    largeSizeList: [],
    natureList: [],
    healthList: [],
  },
  listViewData: {// 获取单风场故障预警汇总-按列表
    totalSize: 0,
    resultList: [],
  },
  fanListData: [], // 获取单风场故障预警汇总-按风机
  singleStationCode: '', //电站编码
  pageNum: 1,
  pageSize: 10,
  sortField: '',
  sortMethod: '',
});


const fetchWarnListReducer = (state = initState, action) => {
  switch (action.type) {
    case faultWarnListAction.changeWarnListStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnListAction.fetchWarnListSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnListAction.resetStore:
      return initState;
  }
  return state;
};

export default fetchWarnListReducer;
