import Immutable from 'immutable';
import {warningAction} from './warningAction.js';

var initState = Immutable.fromJS({
  loading:false,
  thresholdData:'',
  enterpriseId:'',//企业ID
  stationType: "", // 电站类型
  stationName: '', // 电站名称
  getConf:{},//	获取低效组串预警配置
  getClean:{},//获取清洗模型预警配置
  lostGenPercent : null,//低效组串电量损失比阈值
  isSend : null,//低效组串预警自动下发
  sendNum : null,//低效组串预警自动下发数量
  lossPowerPercent:null,//清洗模型电量损失比阈值
})
const  warningReducer = (state = initState, action) => {
  switch (action.type) {
    case warningAction.WARNING_MANAGE_FETCH:
      return state.set('loading', true)
    case warningAction.WARNING_MANAGE_FETCHZ_SUCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false);
    case warningAction.CHANGE_WARNING_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case warningAction.RESET_STORE:
      return initState;
  }
  return state;
}

export default warningReducer;