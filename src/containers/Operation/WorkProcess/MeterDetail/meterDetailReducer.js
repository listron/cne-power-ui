import immutable from 'immutable';
const meterDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  // 获取基本信息数据
  getProcessBaseInfo: Symbol('getProcessBaseInfo'),
  // 获取流程可操作人数据
  getOperableUser: Symbol('getOperableUser'),
  // 获取流程流转信息数据
  getProcessList: Symbol('getProcessList'),
  // 获取有权限电站权限用户
  getBaseUsername: Symbol('getBaseUsername'),
  // 获取处理信息
  getReadMeter: Symbol('getReadMeter'),
  // 添加处理人
  getAddUser: Symbol('getAddUser'),
  // 获取流程可执行动作
  getProcessAction: Symbol('getProcessAction'),
  // 提交验收
  getSubmitAction: Symbol('getSubmitAction'),
  // 领取
  getReceiveAction: Symbol('getReceiveAction'),
  // 保存
  getSaveAction: Symbol('getSaveAction'),
  // 旋转图片
  getRotateImg: Symbol('getRotateImg'),
};

const initState = immutable.fromJS({
  operatorFlag: false, // 执行人是否换行
  stationFlag: false, // 电站名称是否换行
  meterBaseData: {// 基本信息
    stationName: '', // 电站名称
    processType: '', // 工单类型
    createUser: '', // 创建人
    createTime: '', // 创建时间
    planEndTime: '', // 要求完成时间
    endTime: '', // 实际完成时间
    stateName: '', // 当前状态名称
    stateId: '', // 当前状态id
    pageCode: '', // 前端页面组件编码
    stationCode: '', // 电站code
  },
  operableUserData: [{ // 可操作人数据
    ableUsers: null,
    stateName: '',
    ableUserIds: null,
  }, {
    ableUsers: null,
    stateName: '',
    ableUserIds: null,
  }],
  processList: [], // 流程流转信息
  usernameList: [], // 权限用户
  readMeterData: { // 处理信息数据
    docketId: '', // 票据id
    onlineDatas: [], // 上网表信息
    lastReadTime: '', // 上次抄表日期
    thisReadTime: '', // 本次抄表日期
    generationDatas: [], // 发电表信息
    readmeterId: '', // 抄表扩展信息id
    settleMonth: '', // 结算月份
  },
  newReadMeterData: {}, // 备份一份新的处理信息数据（做好对比有没有更改)
  otherReadMeterData: {}, // 需要和原始数据作对比
  checkedUserList: [], // 添加执行人
  addVisible: false, // 添加执行人弹框
  processActionData: [], // 获取流程可执行动作
  editFlag: false, // 编辑
  thisReadTimeFlag: false, // 选择时间
});

const meterDetail = (state = initState, action) => {
  switch (action.type) {
    case meterDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case meterDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case meterDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { meterDetail, meterDetailAction };
