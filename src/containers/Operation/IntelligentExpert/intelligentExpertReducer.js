import immutable from 'immutable';
import moment from 'moment';

const IntelligentExpertAction = {
  GET_INTELLIGENTEXPERT_SUCCESS: Symbol('GET_INTELLIGENTEXPERT_SUCCESS'), // api请求成功
  CHANGEINTELLIGENTEXPERT_STORE_SAGA: Symbol('CHANGEINTELLIGENTEXPERT_STORE_SAGA'), //改变reducer参数
  CHANGE_INTELLIGENTEXPERT_STORE: Symbol('CHANGE_INTELLIGENTEXPERT_STORE'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}

const initState = immutable.fromJS({
  deviceTypeCode: [],	// 设备类型编码
  defectTypeCode: [],	// 缺陷类型编码
  deviceTypes: [], // 设备类型
  defectTypes: [], // 缺陷类型
})

const intelligentExpert = (state = initState, action) => {
  switch (action.type) {
    case IntelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case IntelligentExpertAction.CHANGE_INTELLIGENTEXPERT_STORE:
      return state.merge(immutable.fromJS(action.payload));
    case IntelligentExpertAction.RESET_STORE:
      return initState;
  }
  return state;
}

export { IntelligentExpertAction, intelligentExpert };