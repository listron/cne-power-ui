import immutable from 'immutable';
import { eamListAction } from './eamListAction';
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const initState = immutable.fromJS({
  tableLoading: false,
  selectedStation: [],
  eamListData: arr.map(() => ({
    1: '华南分公司',
    2: '五河金大山风电场',
    3: '工WHYG2020040327',
    4: '升压站PT箱基础台水泥脱落，升压站围栏基础起皮脱落，主控楼顶起砂严重护栏水泥脱落严重，主控楼内墙面裂纹',
    5: '41010000002044',
    6: '27#方阵09#汇流箱07#支路',
    7: '缺陷工单',
    8: '李飞逸',
    9: '2020–04-05 14:20:20',
    10: '新建工单',
    11: '金风科技五河1',
    12: '我是子工单',
    13: '主工单编号',
    14: '风机',
    15: '是',
    16: '2020–04-05 14:20:20',
  })),
  pageSize: 10,
  pageNum: 1,
  pageCount: 1,
});

const eamListReducer = (state = initState, action) => {
  switch (action.type) {
    case eamListAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamListAction.resetStore:
      return initState;
  }
  return state;
};

export default eamListReducer;
