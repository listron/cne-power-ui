import immutable from '../../../../../node_modules/_immutable@3.8.2@immutable';

import { allStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/allStationAction';

var initState = immutable.fromJS({
   loading: false,
   stationDataSummary:{},//电站实时数据汇总
   stationDataList:[],//电站实时数据列表
   pageNum: 1,//当前页号
   pageSize: 10,//每页容纳条数
   //showPage: 'list',//默认展示列表页list,可展示新建add,编辑edit,查看detail页,
  // departmentSource: 2, //部门类型全部2，预设0，自定义1
  // departmentName:'部门名称', //部门名称
  // parentDepartmentName: '所属部门',//所属部门
  // stationName: '负责电站', //负责电站
  // sort: '', //排序字段
  // ascend: true,//排序方式
  // totalNum: 0,//部门总数

  // showAssignStationModal: false,//展示分配电站模态框
  // showAssignUserModal: false,//展示分配用户模态框

  // allDepartment: {},//所有部门基础信息及子父级关系

  // departmentData: [],//部门列表数据
  // departmentDetail:{},//选中部门详细信息
  // selectedDepartment: [], //table选中的部门列表
});

const stationMonitorReducer = (state = initState, action) => {
  switch (action.type) {
    case allStationAction.MONITORSTATION_FETCH:
      return state.set('loading',true)
    case allStationAction.GET_MONITORSTATION_FETCH_SUCCESS :
      return state.merge(immutable.fromJS(action.payload)).set('loading',false)
    case allStationAction.CHANGE_MONITORSTATION_STORE:
      return state.merge(immutable.fromJS(action.payload))
  }
  return state;
}


export default stationMonitorReducer;
