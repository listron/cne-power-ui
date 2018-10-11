import Immutable from 'immutable';

import { planAction } from './planAction';


var initState = Immutable.fromJS({
  loading: false,
  buttonLoading: false,//普通按钮交互loading
  continueAddLoading: false,//继续添加生产计划按钮交互loading
  showPage: 'list',//默认展示列表页list,可展示新建add,编辑edit,查看detail页,
  planYear:'', // 年份选择，默认是当前年
  sort: '', //排序 => 'field,0/1'field代表排序字段，0升序,1降序
  stationCodes:'', // 电站编码
  sortField:'',// 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
  totalNum: 0,//部门总数
  pageNum: 1,//当前页号
  pageSize: 10,//每页容纳条数
  planData: [],//生产计划列表数据
});

const planReducer = (state = initState, action) => {
  switch (action.type) {
    case planAction.PLAN_FETCH:
      return state.set('loading',true)
    case planAction.GET_PLAN_FETCH_SUCCESS :

      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case planAction.CHANGE_PLAN_STORE:
      return state.merge(Immutable.fromJS(action.payload))
  }
  return state;
}


export default planReducer;
