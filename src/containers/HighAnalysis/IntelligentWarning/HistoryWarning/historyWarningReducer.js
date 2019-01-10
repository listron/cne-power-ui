import Immutable from 'immutable';
import { historyWarningActive } from './historyWarningActive';

var initState = Immutable.fromJS({
  warningStatus:'3',//已转工单
  warningType:'限值告警',//限值告警
  loading:'false',
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
});
const historyWarningReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case historyWarningActive.changeHandleRemoveStore:
      return state.merge(Immutable.fromJS(action.payload))
    case historyWarningActive.resetHistoryWarningStore:
      return initState
  }
  return state;
}
export default historyWarningReducer;