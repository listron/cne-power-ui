import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { scoreAction } from './scoreAction.js';
import Cookie from 'js-cookie';


function* changeScoreStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: scoreAction.changeScoreStore,
    payload,
  })
}


function* resetStore() {
  yield put({
    type: scoreAction.RESET_STORE
  })
}

function* changeIsVaild() {
  yield put({
    type: scoreAction.changeScoreStore,
    payload: {
      isVaild: [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ],
      hasInitScore: true
    }
  })
}

function* getScoreConfig(action) { // 评分配置 
  const { payload } = action;
  // const url = '/mock/system/performance/score/conf';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.ScoreConfig}/${payload.reportType}/${payload.isInitValue}`
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: scoreAction.changeScoreStore,
        payload: {
          ...payload,
          indexList: response.data.data.indexList || [],
          basicScore: response.data.data.basicScore,
          reset: !payload.isInitValue === 1
        },
      });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: scoreAction.changeScoreStore,
      payload: {
        indexList: [],
        basicScore: 0,
      },
    });
    console.log(e);
    message.error('获取信息失败', 1)
  }
}

function* editScoreConfig(action) { // 编辑评分配置
  const { payload } = action;
  // const url = '/mock/system/performance/score/conf';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.ScoreConfig}`
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      message.success('修改成功！！！', 1);
      yield put({
        type:scoreAction.changeScoreStore,
        payload:{
          edit:false
        }
      })
      const params = yield select(state => {
        return { 
          reportType: state.system.score.get('reportType'),
          isInitValue:0
         };
      });
      yield put({
        type: scoreAction.getScoreConfig,
        payload: params,
      });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: scoreAction.changeScoreStore,
      payload: {
        edit:false
      },
    });
    console.log(e);
    message.error('修改失败', 1)
  }
}

export function* watchScore() {
  yield takeLatest(scoreAction.changeScoreStoreSaga, changeScoreStore);
  yield takeLatest(scoreAction.resetStore, resetStore);
  yield takeLatest(scoreAction.getScoreConfig, getScoreConfig);
  yield takeLatest(scoreAction.editScoreConfig, editScoreConfig);
  yield takeLatest(scoreAction.changeIsVaild, changeIsVaild);
}