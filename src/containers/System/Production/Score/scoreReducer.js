import Immutable from 'immutable';
import { scoreAction } from './scoreAction.js';

var initState = Immutable.fromJS({
    reportType: '1',//1-集中式光伏电站，2-分布式光伏电站
    basicScore: null,//电站初始分
    indexList: [],//评分指标
    canSave:true, // 是否可以保存 默认为true
    reset:false, // 是否是恢复默认
})

const scoreReducer = (state = initState, action) => {
    switch (action.type) {
        case scoreAction.changeScoreStore:
            return state.merge(Immutable.fromJS(action.payload))
        case scoreAction.RESET_STORE:
            return initState;
    }
    return state;
}

export default scoreReducer;