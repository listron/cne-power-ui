import Immutable from 'immutable';

import { commonAction } from './commonAction';
import Cookie from 'js-cookie';

var initState = Immutable.fromJS({
  menuBoardRequired: [], // 需要配置全局菜单遮罩的企业数组
  menuBoardShow: false, // 全局菜单弹框
  enterpriseId: '',
  enterpriseName: '',
  username: Cookie.get('username'),
  userFullName: Cookie.get('userFullName'),
  userLogo: Cookie.get('userLogo'),
  loading: false,
  stations: [], // 所有电站
  stationTypeCount: 'none', //电站类型  multiple(两种)  pv wind none 
  deviceTypes: [], // 设备类型
  realTimePowerUnit: 'MW',//实时功率单位
  realCapacityUnit: 'MW',//装机容量单位
  powerUnit: '万kWh',//各种发电量单位
  realTimePowerPoint: '',//实时功率保留位数
  realCapacityPoint: '',//装机容量保留位数
  powerPoint: '',//各种发电量保留位数
  deviceModels: [], // 设备型号
  devicePoints: [], // 设备测点
  stationDeviceTypes: [],//电站下的设备

  allDepartmentData: [], // 企业下所有部门(含层级关系)
  allSeries: [],//所有光伏组件
  firstPartitionCode: '',//光伏组件截取的第一项code
  deviceExistInfo: {}, // 验证设备是否存在
  lostGenTypes: [], // 所有故障类型
  dictionary: [], // 获取覆盖类型、并网电压等级、所属电网（区域）忽略原因列表

  devices: [], // 2018-12-22新增: 设备选择专用组件数据。 组件卸载时会自动清空。
  partitions: [], // 2018-12-22新增: 设备选择专用组件数据。 组件卸载时会自动清空。
  filterDevices: [], // 2018-12-22新增: 设备选择专用组件数据。默认与device相同，设备过多性能有问题时，启用该项进行分区筛选
  filterKey: [509], // 2018-12-22新增: 启用的用于指定分区筛选的设备类型-当前默认组件需分区。

  monitorPvUnit:{ // 2019-5-8 只有光伏涉及到需要后台控制单位
    realTimePowerUnit:'MW',//实时功率单位
    realCapacityUnit:'MW',//装机容量单位
    powerUnit:'万kWh',//各种发电量单位
    realTimePowerPoint:'',//实时功率保留位数
    realCapacityPoint:'',//装机容量保留位数
    powerPoint:'',//各种发电量保留位数
  }

});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case commonAction.COMMON_FETCH:
      return state.set('loading', true)
    case commonAction.CHANGE_COMMON_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case commonAction.GET_COMMON_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
    case commonAction.resetCommonStore:
      return initState;
  }
  return state;
}


export default defectReducer;