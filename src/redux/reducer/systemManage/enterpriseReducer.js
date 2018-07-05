import immutable from 'immutable';

import {
  ENTERPRISE_FETCH,
  GET_ENTERPRISE_LIST_SUCCESS,
  CHANGE_SELECTED_ENTERPRISE_SUCCESS
} from '../../../constants/actionTypes/systemManage/enterpriseAction';

var initState = immutable.fromJS({
  loading: false,
  showPage: 'list',//默认展示列表页,可展示新建add,编辑edit,查看detail页,
  filterStatus: 0, //筛选条件全部0，启用1，禁用2
  enterpriseName:'', //筛选条件，企业名称
  enterprisePhone: '',//筛选条件，企业电话
  sort: '', //排序字段
  ascend: true,//排序方式
  enterpriseList: [],//企业列表数据
  currentPage: 1,//当前页
  pageSize: 10,//每页容纳条数
  enterpriseDetail:{},//选中企业详细信息
  selectedEnterprise: [], //table选中企业项
});

const enterpriseReducer = (state = initState, action) => {
  switch (action.type) {
    case ENTERPRISE_FETCH:
      return state.set('loading',true)
    case GET_ENTERPRISE_LIST_SUCCESS :
      return state.merge(immutable.fromJS(action.payload))
    case CHANGE_SELECTED_ENTERPRISE_SUCCESS:
      return state.set('loading',true)
  }

  return state;
}


export default enterpriseReducer;