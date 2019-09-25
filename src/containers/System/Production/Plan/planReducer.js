import Immutable from 'immutable';
import { planAction } from './planAction';

const initState = Immutable.fromJS({
  loading: false,
  // buttonLoading: false,//普通按钮交互loading
  showPage: 'list', //默认展示列表页list,可展示新建add,编辑edit
  // planYear: null, // 年份选择，默认是当前年
  sortMethod: '', //排序 => 'field,0/1'field代表排序字段，0升序,1降序
  stationCodes: null, // 电站编码
  sortField: '', // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
  totalNum: 0, //生产计划总数
  pageNum: 1, //当前页号
  pageSize: 10, //每页容纳条数
  planData: [], //生产计划列表数据
  planStations: [], // 已经添加过的电站
  continueAdd: false, //继续添加生产计划按钮
  addPlanYear: '', //计划生产的年份
  addStationCodes: [], // 计划生产的电站
  planYearList: [], //生产计划的年份(已有的生产计划)
  hasEdit: false, // 添加页面是否编辑
  stationType: null, //电站类型，只可以添加同类型电站
  year: null, //年份选择，默认是当前年
  importLoading: false,//导入的loading
});

const planReducer = (state = initState, action) => {
  switch (action.type) {
    case planAction.PLAN_FETCH:
      return state.set('loading', true);
    case planAction.GET_PLAN_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case planAction.CHANGE_PLAN_STORE:
      return state.merge(Immutable.fromJS(action.payload));
  }
  return state;
};


export default planReducer;
