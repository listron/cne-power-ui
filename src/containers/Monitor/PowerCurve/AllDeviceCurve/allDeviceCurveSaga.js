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
    const url = `${APIBasePath}${monitor.getAllDeviceCurveData}` 
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      
      yield put({
        type:allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS,
        payload: {
          allDeviceCurveData:response.data.data||[],
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图标失败!');
    console.log(error);
  }
}
function *getPowerdeviceList(action) { 
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getPowerdeviceList}` 
    const response = yield call(axios.get, url);
    const total=response.data.data.pageCount||0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if(total === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type:allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS,
        payload: {
          powerCurveListData:response.data.data.dataList||[],
          total,
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线列表失败!');
    console.log(error);
  }
}
function *exportPowerdevice(action) { 
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.exportPowerdevice}` 
    const response = yield call(axios.post, url,payload);
    if (response.data.code === '10000') {
      yield put({
        type:allDeviceCurveAction.GET_ALLDEVICECURVE_SUCCESS,
        payload: {
          exportData:response.data.data||{},
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('功率曲线导出失败!');
    console.log(error);
  }
}

export function* watchAllDeviceCurve() {

  yield takeLatest(allDeviceCurveAction.getAllDeviceCurveData, getAllDeviceCurveData);
  yield takeLatest(allDeviceCurveAction.getPowerdeviceList, getPowerdeviceList);
  yield takeLatest(allDeviceCurveAction.exportPowerdevice, exportPowerdevice);

}
