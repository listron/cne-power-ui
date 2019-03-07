import Immutable from 'immutable';
import { scoreAction } from './scoreAction.js';

var initState = Immutable.fromJS({
    reportType: '1',//1-集中式光伏电站，2-分布式光伏电站
    basicScore: "",//电站初始分
    indexList: [],//评分指标
    hasInitScore:true, // 初始分 默认为true
    reset:false, // 是否是恢复默认
    edit: false, // 是否处于一个编辑状态
    isVaild:[
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
     ], // 判读标准
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