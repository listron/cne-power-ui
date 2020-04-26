import Immutable from 'immutable';
import { warehouseAction } from './warehouseAction.js';

const initState = Immutable.fromJS({
  loading: false,
  warehouseData: { // 仓库列表
    pageCount: 0,
    dataList: [],
  },
  pageSize: 10,
  pageNum: 1,
  sortField: 'create_time',
  sortMethod: 'desc',
  goodsListLoading: true, // 物品列表loading
  warehouseListLoading: true, // 仓库列表loading
  warehouseAddLoading: false, // 仓库添加loading
  goodsAddLoading: false, // 物品添加loading
  warehouseName: '', // 仓库名称（搜索）
  goodsName: '', // 物品名称（搜索）
  goodsData: { // 物品列表
    isAbleOper: 1, // 列表是否可编辑（不可编辑，1：可编辑 0）
    pageData: { // 表格数据
      dataList: [],
      pageCount: 0,
    },
  },
});


const warehouseReducer = (state = initState, action) => {
  switch (action.type) {
    case warehouseAction.warehouseFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.changeWarehouseStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.resetStore:
      return initState;
  }
  return state;
};

export default warehouseReducer;
