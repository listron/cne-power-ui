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
  warehouseName: "", // 仓库名称
  goodsName: "", // 物品名称
  goodsData: { // 物品列表
    isAbleOper: 0, // 列表是否可编辑（不可编辑，0：可编辑 1）
    pageData: { // 表格数据
      dataList: [],
      pageCount: 0
    }
  }
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
