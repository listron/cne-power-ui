import Immutable from 'immutable';
import { warehouseAction } from './warehouseAction.js';

const initState = Immutable.fromJS({
  loading: false,
  warehouseData: { // 仓库列表
    pageCount: 0,
    dataList: []
  },
  pageSize: 10,
  pageNum: 1,
  warehouseName: "" // 仓库名称
});


const warehouseReducer = (state = initState, action) => {
  switch (action.type) {
    case warehouseAction.warehouseFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.changeWarehouseStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.resetStore:
      return initState
  }
  return state;
};

export default warehouseReducer;
