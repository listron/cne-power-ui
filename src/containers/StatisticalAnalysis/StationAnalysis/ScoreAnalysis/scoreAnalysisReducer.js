import Immutable from 'immutable';
import { scoreAnalysisAction } from './scoreAnalysisAction.js';
import moment from 'moment';

let time=moment().subtract(1, 'months').format('YYYY-MM');
var initState = Immutable.fromJS({
    reportType: '',//1-集中式光伏电站，2-分布式光伏电站 null 为全部
    stationCode:null, // 电站编码
    stationType:'1',// 电站类型 0 风电，1 光伏
    dataType:'month',// 日期类型
    time:time,//日期
    stationCodes:[], // 电站编码
    sortField:'scoreValue',
    sortMethod:'desc ',//排序方式  desc asc
    scoreList:[], 
    singleScoreData:{} , // 单电站的数据
    pvStationType:'none',
})

const scoreAnalysisReducer = (state = initState, action) => {
    switch (action.type) {
        case scoreAnalysisAction.changeScoreStore:
            return state.merge(Immutable.fromJS(action.payload))
        case scoreAnalysisAction.RESET_STORE:
            return initState;
    }
    return state;
}

export default scoreAnalysisReducer;