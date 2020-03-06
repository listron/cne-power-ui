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
};

const initState = immutable.fromJS({
  docketId: '', // 缺陷ID

  baseInfo: {}, // 基本信息
  eventInfo: [], // 缺陷事件信息
  handleInfo: [], // 处理信息
  processInfo: [], // 流程信息

  defectTypes: [], //缺陷类型
  deviceTypes: [], // 设备类型
  deviceModes: [], // 设备型号

  isVertify: false, // 是否验证状态
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
