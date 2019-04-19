import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import { faultWarnAction } from './faultWarnAction';

function* changeFaultWarnStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: faultWarnAction.changeHistoryWarnStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: faultWarnAction.RESET_STORE
  })
}

export function* watchHistory() {
  yield takeLatest(faultWarnAction.changeHistoryWarnStoreSaga, changeHistoryWarnStore);
  yield takeLatest(faultWarnAction.resetStore, resetStore);
  yield takeLatest(faultWarnAction.getHistoryWarnList, getHistoryWarnList);
  yield takeLatest(faultWarnAction.getHistoryWarnMatrixList, getHistoryWarnMatrixList);
  yield takeEvery(faultWarnAction.getSequencechart, getSequencechart);

}

