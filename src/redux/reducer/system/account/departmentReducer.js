import immutable from 'immutable';

import { departmentAction } from '../../../../constants/actionTypes/system/account/departmentAction';

var initState = immutable.fromJS({
  loading: false,
  buttonLoading: false,//普通按钮交互loading
  continueAddLoading: false,//继续添加部门按钮交互loading
  showPage: 'list',//默认展示列表页list,可展示新建add,编辑edit,查看detail页,
  departmentSource: 2, //部门类型全部2，预设0，自定义1
  departmentName:'', //部门名称
  parentDepartmentName: '',//所属部门
  stationName: '', //负责电站
  sort: '', //排序字段
  ascend: true,//排序方式
  totalNum: 0,//部门总数
  pageNum: 1,//当前页号
  pageSize: 10,//每页容纳条数
  showAssignStationModal: false,//展示分配电站模态框
  showAssignUserModal: false,//展示分配用户模态框
  
  allDepartment: [],//所有部门基础信息及子父级关系
  allUser: [],//所有用户信息，用于为部门分配用户
  allStation: [],//所有电站信息，用于为部门分配电站

  departmentData: [],//部门列表数据
  departmentDetail:{},//选中部门详细信息
  selectedDepartment: [], //table选中的部门列表
});

const departmentReducer = (state = initState, action) => {
  switch (action.type) {
    case departmentAction.DEPARTMENT_FETCH:
      return state.set('loading',true)
    case departmentAction.GET_DEPARTMENT_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case departmentAction.CHANGE_DEPARTMENT_STORE:
      return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default departmentReducer;