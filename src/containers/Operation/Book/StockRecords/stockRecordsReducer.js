import immutable from 'immutable';
import moment from 'moment';
import { stockRecordsAction } from './stockRecordsAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  startTime: moment().startOf('day').subtract(0, 'day'),
  endTime: moment(),
  pageNum: 1, // 当前页（第一页）
  pageSize: 10, // 每页条数
  warehouseNames: [], // 仓库名称下拉列表
  warehouseId: '', // 仓库id
  goodsType: '', // 库存类型
  sortField: '', // 排序字段
  sortMethod: '', // 排序规则 "asc"：正序  "desc"：倒序
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

