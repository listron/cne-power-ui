import immutable from 'immutable';
import { intelligentExpertAction } from './intelligentExpertAction.js';

const initState = immutable.fromJS({
  tableLoading: false, // 列表请求的loading
  listParams: { // 请求列表数据的参数集合
    type: '0',
    deviceTypeCodes: [],	// 选中的设备类型编码
    faultTypeIds: [],
    faultDescription: '', // 故障／缺陷描述
    recorder: '', // 录入人
    pageNum: 1, // 当前页（第一页）
    pageSize: 10, // 每页条数
    orderField: 'like_count', // 排序字段
    sortMethod: 'desc', // 排序方式 asc升序; desc 降序
  },
  showPage: 'list', // list 展示的页面：add添加，edit编辑，detail详情
  knowledgeBaseId: '', // 查看编辑 详情ID
  deviceTypes: [], // 设备类型
  defectTypes: [], // 缺陷类型
  intelligentTableData: {}, // 列表数据
  intelligentDetail: {}, // 查看详情页面数据
  usernames: [], // 获取录入人
  selectedRowKeys: [],
  stationType: '0',
  deviceModeList: [], // 设备型号的列表
  faultCodeList: [], // 故障代码的列表
});

const intelligentExpert = (state = initState, action) => {
  switch (action.type) {
    case intelligentExpertAction.changeIntelligentExpertStore:
      return state.merge(immutable.fromJS(action.payload));
    case intelligentExpertAction.resetStore:
      return initState;
  }
  return state;
};

export default intelligentExpert;
