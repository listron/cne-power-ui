import immutable from 'immutable';
import { stockRecordsAction } from './stockRecordsAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  warehouseNames: [], // 仓库名称下拉列表
  inRecordListData: [], // 入库列表数据
  outRecordListData: [], // 出库列表数据
  tableType: 'inRecord', // 切换列表：入库inRecord，出库outRecord
  pageCount: 0, // 总数
  listParams:{ // 列表信息
    startTime: null,
    endTime: null,
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
    warehouseId: null, // 仓库id
    goodsType: null, // 库存类型
    sortField: '', // 排序字段
    sortMethod: '', // 排序规则：asc正序  desc倒序
  },
})

const stockRecords = (state = initState, action) => {
  switch (action.type) {
    case stockRecordsAction.GET_STOCKRECORDS_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case stockRecordsAction.stockRecordsStore:
      return state.merge(immutable.fromJS(action.payload));
    case stockRecordsAction.resetStore:
      return initState;
  }
  return state;
}

export default stockRecords;

