import Immutable from 'immutable';
import {warningAction} from './warningAction.js';

var initState = Immutable.fromJS({
  loading:false,
  enterpriseId:'',//企业ID
  getConf:{},//	获取低效组串预警配置
  getClean:{},//获取清洗模型预警配置
  pageName:'home', // 当前页面  主页
})
const  warningReducer = (state = initState, action) => {
  switch (action.type) {
    case warningAction.changeWarnStore: 
      return state.merge(Immutable.fromJS(action.payload))
    case warningAction.RESET_STORE:
      return initState;
  }
  return state;
}

export default warningReducer;