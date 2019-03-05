import { call, put, takeLatest, select, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allDeviceCurveAction } from './allDeviceCurveAction';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;







function *getAllDeviceCurveData(action) { 
  const { payload } = action;
  try {
    const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      type:allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS,
      yield put({
        payload: {
          allDeviceCurveData:response.data.data||[],
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取多设备类型数据失败!');
    console.log(error);
  }
}

export function* watchAllDeviceCurve() {

  yield takeLatest(allDeviceCurveAction.getAllDeviceCurveData, getAllDeviceCurveData);

}
