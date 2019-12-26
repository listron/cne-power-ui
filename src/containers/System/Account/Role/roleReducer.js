import Immutable from 'immutable';

import { roleAction } from './roleAction';

var initState = Immutable.fromJS({
  loading: false,
  showPage: 'list',//默认展示列表页,可展示列表:list/新建:create/编辑:edit,
  roleData: [],//角色列表数据
  menuData: [],//功能列表数据
  defaultMenuData: [], // 默认具有的功能角色
  selectedRole: [], //table选中角色,
  continueAdd: false,
  error: {},
  operatetypeData: [], // 获得权限操作类型
});

const roleReducer = (state = initState, action) => {
  switch (action.type) {
    case roleAction.ROLE_FETCH:
      return state.set('loading', true);
    case roleAction.GET_ROLE_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case roleAction.CHANGE_ROLE_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case roleAction.RESET_ROLE:
      return initState;
  }
  return state;
}


export default roleReducer;