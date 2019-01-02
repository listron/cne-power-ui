import Immutable from 'immutable';
import { transferFormActive } from './transferFormActive.js';

var initState = Immutable.fromJS({
  warningStatus:'3',//已转工单
  warningType:'限制告警',//限制告警
  loading:'false',
  oneWarningNum:null,//一级告警
  twoWarningNum: null,//二级告警
  threeWarningNum: null,//三级告警
  fourWarningNum:null,//四级告警
});
const transferFormReducer = (state = initState, action) => {
  switch (action.type) {
    // case realtimeWarningActive.huoquchenggong:
    //   return state.set('loading', true)
    case transferFormActive.changeTransferFormStore:
      return state.merge(Immutable.fromJS(action.payload))
    case transferFormActive.resetTransferFormStore:
      return initState
  }
  return state;
}
export default transferFormReducer;