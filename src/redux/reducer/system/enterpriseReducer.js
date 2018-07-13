import immutable from 'immutable';

import { enterpriseAction } from '../../../constants/actionTypes/system/enterpriseAction';

var initState = immutable.fromJS({
  loading: false,
  showPage: 'detail',//默认展示列表页,可展示新建/编辑edit,查看detail页,
  filterStatus: 2, //筛选条件全部2，启用0，禁用1
  enterpriseName:'', //筛选条件，企业名称
  enterprisePhone: '',//筛选条件，企业电话
  sort: '', //排序字段
  ascend: true,//排序方式
  enterpriseData: [],//企业列表数据
  totalNum: 0,//企业总数
  currentPage: 1,//当前页
  pageSize: 10,//每页容纳条数
  enterpriseDetail:{},//选中企业详细信息
  selectedEnterprise: [], //table选中企业项
});

const enterpriseReducer = (state = initState, action) => {
  switch (action.type) {
    case enterpriseAction.ENTERPRISE_FETCH:
      return state.set('loading',true)
    case enterpriseAction.GET_ENTERPRISE_COMMON_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case enterpriseAction.GET_ENTERPRISE_ATTR_CHANGE_SUCCESS:
      return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default enterpriseReducer;