import Immutable from 'immutable';
import { warningAction } from './warningAction.js';

var initState = Immutable.fromJS({
  loading: false,
  enterpriseId: '', //企业ID
  getConf: {}, //	获取低效组串预警配置
  getClean: {}, //获取清洗模型预警配置
  lostGenPercent: null, // 低效组串预警配置 损失电量比
  isSend: null, // 低效组串预警配置 是否下发
  sendNum: '', // 低效组串预警配置 下发条数
  lossPowerPercent: null, //清洗模型预警配置 损失电量比
  showPage: 'home', // 当前页面  主页  edit 编辑页 add 新增页  detail 详情页

  warnList: [], // 预警列表
  stationDeviceTypes: [], // 电站下设备类型
  deviceModels: [], // 电站设备类型下设备型号
  devicePoints: [], // 设备测点列表
  allStationBaseInfo: [], // 用户所在企业下所有电站基本信息(与用户token无关)
  ruleStationDeviceTypes: [], // 规则电站下设备类型
  ruleDeviceModels: [], // 规则电站设备类型下设备型号
  ruleDevicePoints: [], // 规则设备测点列表
  listQueryParams: {
    stationCode: null, // 电站编码
    deviceTypeCode: null, // 设备类型编码
    deviceModeCode: null, // 设备型号编码
    pointCode: '', // 测点编码
    pageNum: 1,
    pageSize: 10,
    sortField: '1', // 1 是告警级别
    sortOrder: '1', //  1 asc  2 desc
    warningType: '201', // 201 预警  告警查看告警列表
  },
  totalNum: 0, //  所有的数据

  warnDetail: {}, // 预警配置详情
});
const warningReducer = (state = initState, action) => {
  switch (action.type) {
    case warningAction.changeWarnStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warningAction.RESET_STORE:
      return initState;
  }
  return state;
};

export default warningReducer;
