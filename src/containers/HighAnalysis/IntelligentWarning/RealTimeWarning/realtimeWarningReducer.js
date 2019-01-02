import Immutable from 'immutable';
import { realtimeWarningActive } from './realtimeWarningActive.js';

var initState = Immutable.fromJS({
  warningStatus:'1',//实时告警
  warningType:'限制告警',//限制告警
  loading:'false',
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
});
const realtimeWarningReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case realtimeWarningActive.changeRealtimeWarningStore:
      return state.merge(Immutable.fromJS(action.payload))
    case realtimeWarningActive.resetRealtimeWarninStore:
      return initState
  }
  return state;
}
export default realtimeWarningReducer;