import { takeLatest } from 'redux-saga/effects';
import { algorithmControlAction } from './algorithmControlAction';

//获取巡检列表信息
function* getInspectList() {
  try{
    console.log("-----");
  } catch (e) {
    console.log(e);
  }
}

export function* watchAlgorithmControl() {
  yield takeLatest(algorithmControlAction.changeAlgorithmControlStore, getInspectList);

}

