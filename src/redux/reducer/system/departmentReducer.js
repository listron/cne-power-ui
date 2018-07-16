import immutable from 'immutable';

import { departmentAction } from '../../../constants/actionTypes/system/departmentAction';

var initState = immutable.fromJS({
  loading: false,
  showPage: 'list',//默认展示列表页list,可展示新建/编辑edit,查看detail页,
  departmentSource: 2, //部门类型全部2，预设0，自定义1
  departmentName:'部门名称', //部门名称
  parentDepartmentName: '所属部门',//所属部门
  stationName: '负责电站', //负责电站
  sort: '', //排序字段
  ascend: true,//排序方式
  totalNum: 0,//部门总数
  pageNum: 1,//当前页号
  pageSize: 10,//每页容纳条数
  
  departmentData: [],//部门列表数据
  departmentDetail:{},//选中部门详细信息
  selectedDepartment: [], //table选中的部门列表
});

const departmentReducer = (state = initState, action) => {
  switch (action.type) {
    case departmentAction.DEPARTMENT_FETCH:
      return state.set('loading',true)
    case departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case departmentAction.CHANGE_DEPARTMENT_STORE_SUCCESS:
      return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default departmentReducer;