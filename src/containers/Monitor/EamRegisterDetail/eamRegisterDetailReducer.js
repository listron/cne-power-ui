import immutable from 'immutable';
const eamRegisterDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  // 查询告警登记记录
  getEamDiagList: Symbol('getEamDiagList'),
  // 获取EAM故障登记详情
  getEamFaultDetails: Symbol('getEamFaultDetails'),
  // 获取EAM故障缺陷详情
  getEamDefectDetails: Symbol('getEamDefectDetails'),
};

const initState = immutable.fromJS({
  diagLoading: false,
  detailLoading: false,
  eamFaultData: { // 获取EAM故障详情
    faultNo: '',
    stationName1: '',
    stationName2: '',
    stopType: '',
    assetNo1: '',
    assetNo2: '',
    location1: '',
    location2: '',
    faultCode1: '',
    faultCode2: '',
    manufacturer: '',
    model: '',
    faultLevel: '',
    faultSysType1: '',
    faultSysType2: '',
    monitorSysFault: '',
    status: '',
    createName: '',
    createTime: '',
    faultStartTime: '',
    faultEndTime: '',
    reason: '',
  },
  eamDefectData: { // 获取EAM缺陷详情
    defectNo: '',
    stationName1: '',
    stationName2: '',
    defectType: '',
    assetNo1: '',
    assetNo2: '',
    location1: '',
    location2: '',
    defectDetail: '',
    status: '',
    createName: '',
    createTime: '',
    projectSource: '',
    phone: '',
    faultStartTime: '',
    woprofess: '',
  },
  workOrderList: [], // 子工单列表
  eamDiagList: [], // 查询告警登记记录
});

const eamRegisterDetail = (state = initState, action) => {
  switch (action.type) {
    case eamRegisterDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eamRegisterDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eamRegisterDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { eamRegisterDetail, eamRegisterDetailAction };
