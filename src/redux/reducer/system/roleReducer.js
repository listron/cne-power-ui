import immutable from 'immutable';

import { roleAction } from '../../../constants/actionTypes/system/roleAction';

var initState = immutable.fromJS({
  isFetching: false,
  showPage: 'list',//默认展示列表页,可展示新建/编辑edit,查看detail页,
  sort: '', //排序字段
  ascend: true,//排序方式
  roleData: [],//角色列表数据
  totalNum: 0,//角色总数
  currentPage: 1,//当前页
  pageSize: 10,//每页容纳条数
  selectedRole: [], //table选中角色
});

const roleReducer = (state = initState, action) => {
  switch (action.type) {
    case roleAction.ROLE_FETCH:
      return state.set('isFetching', true);
    case roleAction.GET_ROLE_LIST_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('isFetching',false);
    case roleAction.CHANGE_ROLE_STORE:
      return state.merge(immutable.fromJS(action.payload));
  }
  return state;
}


export default roleReducer;