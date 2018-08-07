import immutable from 'immutable';

import { roleAction } from '../../../../constants/actionTypes/system/account/roleAction';

var initState = immutable.fromJS({
  isFetching: false,
  showPage: 'list',//默认展示列表页,可展示列表:list/新建:create/编辑:edit,
  totalNum: 0,
  roleData: [],//角色列表数据
  menuData: [],//功能列表数据
  selectedRole: [], //table选中角色
});

const roleReducer = (state = initState, action) => {
  switch (action.type) {
    case roleAction.ROLE_FETCH:
      return state.set('isFetching', true);
    case roleAction.GET_ROLE_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('isFetching',false);
    case roleAction.CHANGE_ROLE_STORE:
      return state.merge(immutable.fromJS(action.payload));
  }
  return state;
}


export default roleReducer;