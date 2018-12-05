import Immutable from 'immutable';
import { cleanoutRecordAction } from './cleanoutRecordAction';

var initState = Immutable.fromJS({
  loading: false,
  startTime:'2018',
  stationCodes: '', 
  showPage: 'multiple', //默认展示列表页list ,   编辑edit,详情detail,
  stationType: "", // 电站类型("0"-风电、"1"-光伏、""全部)
  regionName: '', // 电站所属区域:所属电网，模糊匹配
  stationName: '', // 电站名称(模糊匹配)
  pageNum: 1, // 当前页
  pageSize: 10, // 每页条数
  orderField: '', // 排序字段 '1'：电站名称; '2':区域 ;'3':覆盖类型;'4':并网类型;'5'：装机容量;'6':发点单元数;'7'：电站接入
  orderCommand: '', // 排序方式 ;"1"升序; "2"降序
  stationList: [], // 电站列表数据
  totalNum:  0, // 电站总数

  selectedStationIndex: null, // 展示详情的电站index
  stationDetail: {},// 电站详情
  allDepartmentData: [], // 所有部分列表信息
  stationBelongInfo: {}, // 电站的各种所属分类信息汇总。

});

const CleanoutWarningReducer = (state = initState, action) => {
  switch (action.type) {
    case cleanoutRecordAction.CLEANOUT_RECORD_FETCH:
      return state.set('loading',true)
    case cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
    case cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case cleanoutRecordAction.RESET_STORE:
      return initState
  }
  return state;
}

export default CleanoutWarningReducer;