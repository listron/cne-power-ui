import immutable from 'immutable';
import moment from 'moment';

const defectDetailAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDefectDetail: Symbol('getDefectDetail'),
  getRelevancedocket: Symbol('getRelevancedocket'),
  getDefectCommonList: Symbol('getDefectCommonList'),
  getDefectTypes: Symbol('getDefectTypes'),
  sendDefect: Symbol('sendDefect'),
  rejectDefect: Symbol('rejectDefect'),
  closeDefect: Symbol('closeDefect'),
  handleDefect: Symbol('handleDefect'),
  checkDefect: Symbol('checkDefect'),
  getKnowledgebase: Symbol('getKnowledgebase'),
  likeKnowledgebase: Symbol('likeKnowledgebase'),
  createDefect: Symbol('createDefect'),
};

const initState = immutable.fromJS({
  defectId: '', // 缺陷ID
  defectDetail: {}, // 消缺详情
  processData: [], // 流程信息
  commonList: [], //缺陷常用语
  knowledgebaseList: [], // 专家库列表
  dockerDetail: {}, // 两票数据
  deviceTypes: [], //设备类型
  defectTypes: [], //缺陷类型
  hasModify: false, // 是否修改 默认没有修改
});

const defectDetail = (state = initState, action) => {
  switch (action.type) {
    case defectDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case defectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case defectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { defectDetail, defectDetailAction };
