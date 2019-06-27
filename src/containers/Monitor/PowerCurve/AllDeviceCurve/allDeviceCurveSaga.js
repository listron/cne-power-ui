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
    //  const url = '/mock/wind/powercurve/fans/chart'; 
    yield put({
      type:allDeviceCurveAction.changeAllDeviceStore,
      payload: {
        ...payload,
         chartLoading:true
      }
    })
    const response = yield call(axios.post, url,payload);
    if (response.data.code === '10000') {
      yield put({
        type:allDeviceCurveAction.changeAllDeviceStore,
        payload: {
          allData:response.data.data||{},
          allDeviceCurveData:response.data.data.actualDataList||[],
          theoryDataList:response.data.data.actualDataList||[],
          chartLoading:false
          // ...payload
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表失败!');
    console.log(error);
    yield put({
      type:allDeviceCurveAction.changeAllDeviceStore,
      payload: {
        allData:{},
        allDeviceCurveData:[],
        theoryDataList:[],
        chartLoading:false
      }
    })
  }
}
function *getPowerdeviceList(action) { 
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getPowerdeviceList}` 
    const response = yield call(axios.post, url,payload);
    // const total=response.data.data.pageCount||0;
    // let { pageNum, pageSize } = payload;
    // const maxPage = Math.ceil(total / pageSize);
    // if(total === 0){ // 总数为0时，展示0页
    //   pageNum = 1;
    // }else if(maxPage < pageNum){ // 当前页已超出
    //   pageNum = maxPage;
    // }
    if (response.data.code === '10000') {
      yield put({
        type:allDeviceCurveAction.changeAllDeviceStore,
        payload: {
          powerCurveListData:response.data.data||[],
          // total,
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


export function* watchAllDeviceCurve() {
  yield takeLatest(allDeviceCurveAction.getAllDeviceCurveData, getAllDeviceCurveData);
  yield takeLatest(allDeviceCurveAction.getPowerdeviceList, getPowerdeviceList);
}
