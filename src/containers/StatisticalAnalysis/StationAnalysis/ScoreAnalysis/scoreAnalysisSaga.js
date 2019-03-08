import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { scoreAnalysisAction } from './scoreAnalysisAction';


function* changeScoreStore(action) { // 存储payload指定参数，替换reducer-store属性。
    const { payload } = action;
    yield put({
        type: scoreAnalysisAction.changeScoreStore,
        payload,
    })
}


function* resetStore() {
    yield put({
        type: scoreAnalysisAction.RESET_STORE
    })
}

function* getScoreList(action) { 
    const { payload } = action;
    // const url = '/mock/system/performance/score/conf';
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScoreList}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: scoreAnalysisAction.changeScoreStore,
                payload: {
                    pvParams:{...payload,},
                    scoreList: response.data.data || [],
                },
            });
        } else { throw response.data.data }
    } catch (e) {
        yield put({
            type: scoreAnalysisAction.changeScoreStore,
            payload: {
                scoreList: []
            },
        });
        console.log(e);
        message.error('请求数据失败', 1)
    }
}


function* singleStaionScore(action) {  
    const { payload } = action;
    const { stationCode, dataType, time } = payload;
    // const url = '/mock/system/performance/score/conf';
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.singleStaionScore}/${stationCode}/${dataType}/${time}`
    try {
        const response = yield call(axios.get, url);
        if (response.data.code === '10000') {
            yield put({
                type: scoreAnalysisAction.changeScoreStore,
                payload: {
                    ...payload,
                    singleScoreData: response.data.data || {},
                },
            });
        } else { throw response.data.data }
    } catch (e) {
        yield put({
            type: scoreAnalysisAction.changeScoreStore,
            payload: {
                singleScoreData: {},
            },
        });
        console.log(e);
        message.error('获取信息失败', 1)
    }
}



function* getPvStationType(action) {
    // const url = '/mock/system/performance/score/conf';
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getPvStationType}`
    try {
        const response = yield call(axios.get, url);
        if (response.data.code === '10000') {
            const stationTypes = new Set(response.data.data.map(e => e.reportType));
            let pvStationType = 'none';
            if (stationTypes.size === 2) { // 两种类型电站都有
                pvStationType = 'multiple';
            } else if (stationTypes.has(2)) { // 只有分布式光伏电站
                pvStationType = 'distributed';
            } else if (stationTypes.has(1)) { // 只有集中式分布电站
                pvStationType = 'centralized';
            }
            yield put({
                type: scoreAnalysisAction.changeScoreStore,
                payload: {
                    pvStationType: pvStationType,
                },
            });
        } else { throw response.data.data }
    } catch (e) {
        yield put({
            type: scoreAnalysisAction.changeScoreStore,
            payload: {
                pvStationType: 'none'
            },
        });
        console.log(e);
        message.error('请求数据失败', 1)
    }
}


export function* watchScoreAnalysis() {
    yield takeLatest(scoreAnalysisAction.changeScoreStoreSaga, changeScoreStore);
    yield takeLatest(scoreAnalysisAction.resetStore, resetStore);
    yield takeLatest(scoreAnalysisAction.getPvStationType, getPvStationType);
    yield takeLatest(scoreAnalysisAction.getScoreList, getScoreList);
    yield takeLatest(scoreAnalysisAction.singleStaionScore, singleStaionScore);
}