import immutable from 'immutable';
import moment from 'moment';

const eliminateDefectDetailAction = {
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
  deviceTypes: [], //设备类型
  defectTypes: [], //缺陷类型
});

const eliminateDefectDetail = (state = initState, action) => {
  switch (action.type) {
    case eliminateDefectDetailAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case eliminateDefectDetailAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case eliminateDefectDetailAction.resetStore:
      return initState;
  }
  return state;
};

export { eliminateDefectDetail, eliminateDefectDetailAction };
