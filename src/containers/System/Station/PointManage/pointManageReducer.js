import Immutable from 'immutable';

import { pointManageAction } from './pointManageAction';

var initState = Immutable.fromJS({
  showPage: 'list',
  loading: false,
  exportLoading: false, // 导出测电表loading 

  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  devicePointStandardCode: '', //测点编号
  devicePointName: '', //测点描述
  pageNum: 1,
  pageSize: 10,
  orderField: '', // 排序字段
  orderType: null, // 排序方式0正序   1倒序

  totalNum: 0, // 设备总数
  stationDeviceTypes: [], // 电站下设备类型。
  deviceModels: [], // 电站设备类型下设备型号
  pointList: [], // 设备列表
  stationPointStatusList: [], // 请求所有电站=>匹配选中电站是否可删除测点
  allStationBaseInfo: [], // 用户所在企业下所有电站基本信息(与用户token无关)
  selectedRowKeys: [],
  selectedRowData: [],
  allFactor: [], //所有厂家
  factorsDeviceModeData: [], //厂家下的型号
  pointDetail: {},
});

const pointManageReducer = (state = initState, action) => {
  switch (action.type) {
    case pointManageAction.POINT_MANAGE_FETCH:
      return state.set('loading', true);
    case pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case pointManageAction.CHANGE_POINT_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case pointManageAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default pointManageReducer;
