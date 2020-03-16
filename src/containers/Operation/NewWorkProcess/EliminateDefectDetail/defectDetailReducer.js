import immutable from 'immutable';
import moment from 'moment';

const eliminateDefectDetailAction = {
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDefectAction: Symbol('getDefectAction'),
  createDefect: Symbol('createDefect'),
  getDefectBaseInfo: Symbol('getDefectBaseInfo'),
  getDefectEventInfo: Symbol('getDefectEventInfo'),
  getDefectHandleInfo: Symbol('getDefectHandleInfo'),
  addDefectHandle: Symbol('addDefectHandle'),
  getProcessInfo: Symbol('getProcessInfo'),
  acceptanceDocket: Symbol('acceptanceDocket'),
  verifyDocket: Symbol('verifyDocket'),
  receiveDocket: Symbol('receiveDocket'),
  getDefectMessage: Symbol('getDefectMessage'),
  returnDocket: Symbol('returnDocket'),
  deleteDocket: Symbol('deleteDocket'),
  addAbleUser: Symbol('addAbleUser'),
  submitAction: Symbol('submitAction'),
  defectTypes: Symbol('defectTypes'),
  getBaseUsername: Symbol('getBaseUsername'),
};

const initState = immutable.fromJS({
  docketId: null, // 缺陷ID
  isFinish: null,
  stationCode: null, // 电站Code
  allowedActions: [], //可执行的动作
  baseInfo: {}, // 基本信息
  stateId: null, //  状态ID
  stateName: '', // 状态名称  状态名称是确定的，不会根据不同的企业ID发生变化
  operUserInfo: [], //操作人的列表
  usernameList: [], // 获取电站权限的人
  eventInfos: [], // 缺陷事件信息
  warnEventInfos: [], // 告警缺陷事件
  handleInfos: [], // 处理信息
  processInfo: [], // 流程信息

  defectTypes: [], //缺陷类型
  deviceTypes: [], // 设备类型
  deviceModes: [], // 设备型号

  isVertify: false, // 是否验证状态
  addbaseInfo: {}, // 添加的基本信息
  addEventInfo: [], // 添加的缺陷事件
  addhandleList: [], // 添加的处理记录
  addOperater: [], // 新增加的操作人
  eventStatus: [], // 验收工单的时候 缺陷事件状态
});

const eliminateDefectDetail = (state = initState, action) => {
  switch (action.type) {
    case eliminateDefectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eliminateDefectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { eliminateDefectDetail, eliminateDefectDetailAction };
