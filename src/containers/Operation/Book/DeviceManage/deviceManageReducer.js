import Immutable from 'immutable';

import { deviceManageAction } from './deviceManageAction';

const initState = Immutable.fromJS({
  selectType: 'deviceInfo',
  exportLoading: false, // 导出设备表loading
  loading: false,
  stationCode: null, // 选中的电站
  deviceType: null, //筛选设备类型，为了和新增设备类型的分开
  deviceTypeCode: null, // 选中的设备类型
  manufactorId: null, //厂家Id
  deviceModeCode: null, // 选中的设备型号
  deviceFullcode: '',
  pageNum: 1,
  pageSize: 10,
  totalNum: 0, // 设备总数
  sortField: '', // 排序字段
  sortMethod: '', // 排序方式('0':正序,'1': 倒序)
  showPage: 'list',
  deviceList: [], // 设备列表
  orderMethod: 'desc', //设备厂家列表传参
  orderField: '1', //设备厂家列表传参
  stationDeviceTypes: [], //电站下设备类型
  deviceModels: [], // 电站设备类型下设备型号
  pvDeviceModels: [], //光伏组件下的设备型号
  allStationBaseInfo: [], // 用户所在企业下所有电站基本信息(与用户token无关)
  selectedStationIndex: null, // 展示详情的电站index
  stationDeviceDetail: {}, //设备详情
  connectDevice: [], //关联设备
  selectedRowKeys: [], //选择的行的索引
  selectedRowData: [], //选择的行的数据
  addDeviceTypeData: {}, //添加设备类型结果
  stationDevices: [], //电站下设备类型
  addSuccess: null,
  deviceNameOk: null,
  checkDeviceModeOk: null,
  checkDeviceTypeok: null,
  addDeviceModeData: {}, //添加设备型号结果
  addPvDeviceModeData: {}, //添加光伏组件型号结果
  checkDeviceNameData: {}, //添加设备名重复结果
  checkDeviceTypeData: {}, //添加设备类型重复结果
  checkDeviceModeData: {}, //添加设备型号重复结果
  deviceFactorsData: {//设备厂家数据
    isOperator: 1,
    dataList: [],
  },
  factorsDeviceModeData: [], //设备厂家下的型号
  addmanufactorId: '', //新增设备厂家的Id
  partInfoData: [], //部件信息table
  fixRecordData: [], //检修记录table
  historyWarningData: [], //设备历史告警table

});

const deviceManageReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceManageAction.DEVICE_MANAGE_FETCH:
      return state.set('loading', true);
    case deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case deviceManageAction.CHANGE_DEVICE_MANAGE_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case deviceManageAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default deviceManageReducer;
