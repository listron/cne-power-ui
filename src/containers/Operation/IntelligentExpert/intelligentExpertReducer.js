import immutable from 'immutable';
import { intelligentExpertAction } from './intelligentExpertAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  listParams: { // 请求列表数据的参数集合
    deviceTypeCodes: [],	// 选中的设备类型编码
    defectTypeCodes: [],	// 选中的缺陷类型编码
    faultDescription: '', // 缺陷描述
    recorder: '', // 录入人
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
    total: 0, // 总数
    orderField: '', // 排序字段
    sortMethod: '', // 排序方式 asc升序; desc 降序
  },
  showPage:'list', // 展示的页面：add添加，edit编辑
  selectedRowKeys:[],//选择的行的索引
  selectedRowData:[],//选择的行的数据
  knowledgeBaseIds: '', //id数组
  deviceTypes: [], // 设备类型
  defectTypes: [], // 缺陷类型
  intelligentTableData: [], // 列表数据
  usernames: [], // 获取录入人
})

const intelligentExpert = (state = initState, action) => {
  switch (action.type) {
    case intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case intelligentExpertAction.getIntelligentExpertStore:
      return state.merge(immutable.fromJS(action.payload));
    case intelligentExpertAction.RESET_STORE:
      return initState;
  }
  return state;
}

export default intelligentExpert;