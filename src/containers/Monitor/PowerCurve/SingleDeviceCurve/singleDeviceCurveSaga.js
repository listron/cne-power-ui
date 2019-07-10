import { call, put, takeLatest, all, select, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import Path from '../../../../constants/path';
import { singleDeviceCurveAction } from './singleDeviceCurveAction';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function* getSingleDeviceCurveData(action) { //功率曲线图表-功率曲线-单风机
  const { payload } = action;
  // const powercurveUrl = `/mock/wind/powercurve/fan/powercurvechart`;
  const powercurveUrl = `${APIBasePath}${monitor.getSingleDeviceCurveData}`;
  const response = yield call(axios.post, powercurveUrl, payload);
  try {
    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          singleDeviceCurveData: response.data.data.powerCurveData || [],
          airDensity: response.data.data.airDensity || '',
          curveTime: moment().unix(), //时间戳
        },
      });
    } else if (response.data.code === '40021') {
      message.warning('单风机校正后风速为空');
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-功率曲线-单风机失败!');
    console.log(error);
  }
}
function* getSingleDeviceCurveList(action) { //功率曲线列表-单风机
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getSingleDeviceCurveList}`;
    const response = yield call(axios.post, url, payload);
    const total = response.data.data.pageCount || 0;
    let { pageNum } = payload;
    const { pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          singleDeviceCurveList: response.data.data.dataList || [],
          total,

        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取单设备功率曲线列表失败!');
    console.log(error);
  }
}

function* getRoseChart(action) { //功率曲线图表-风向玫瑰图-单风机
  const { payload } = action;
  // const RoseChartUrl = `/mock/wind/powercurve/fan/windrosechart`;
  const RoseChartUrl = `${APIBasePath}${monitor.getRoseChart}`;
  try {
    const rose = yield call(axios.post, RoseChartUrl, { ...payload });
    if (rose.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          roseChartData: rose.data.data || [],
        },
      });
    }

  } catch (error) {
    message.error('获取功率曲线图表-风向玫瑰图-单风机失败!');
    console.log(error);
  }
}
function* getpowerspeedchart(action) { //功率曲线图表-功率&转速-单风机
  const { payload } = action;
  try {
    // const url = '/mock//wind/powercurve/fan/powerspeedchart'; 
    const url = `${APIBasePath}${monitor.getpowerspeedchart}`;
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          powerspeedchartData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-功率&转速-单风机失败!');
    console.log(error);
  }
}
function* getpitchanglespeedchart(action) { //功率曲线图表-桨距角&风速-单风机
  const { payload } = action;
  try {
    // const url = '/mock/wind/powercurve/fan/pitchanglespeedchart'; 
    const url = `${APIBasePath}${monitor.getpitchanglespeedchart}`;
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          pitchanglespeedchartData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-桨距角&风速-单风机失败!');
    console.log(error);
  }
}
function* getwinddistributionchart(action) { //功率曲线图表-风频分布-单风机
  const { payload } = action;
  try {
    // const url = '/mock/wind/powercurve/fan/winddistributionchart'; 
    const url = `${APIBasePath}${monitor.getwinddistributionchart}`;
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          winddistributionchartData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-风频分布-单风机失败!');
    console.log(error);
  }
}
function* getsequencechart(action) { //功率曲线图表-时序图-单风机
  const { payload } = action;
  try {
    // const url = '/mock/wind/powercurve/fan/sequencechart'; 
    const url = `${APIBasePath}${monitor.getsequencechart}`;
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          sequencechartData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-时序图-单风机失败!');
    console.log(error);
  }
}
function* getDeviceInfo(action) { //设备型号详情，全编码获得名称
  const { payload } = action;
  try {

    const url = `${APIBasePath}${monitor.getDeviceInfo}/${payload.deviceFullcode}`;
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          deviceInfo: response.data.data || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取功率曲线图表-时序图-单风机失败!');
    console.log(error);
  }
}
export function* watchSingleDeviceCurve() {
  yield takeLatest(singleDeviceCurveAction.getSingleDeviceCurveData, getSingleDeviceCurveData);
  yield takeLatest(singleDeviceCurveAction.getSingleDeviceCurveList, getSingleDeviceCurveList);
  yield takeLatest(singleDeviceCurveAction.getRoseChart, getRoseChart);
  yield takeLatest(singleDeviceCurveAction.getpowerspeedchart, getpowerspeedchart);
  yield takeLatest(singleDeviceCurveAction.getpitchanglespeedchart, getpitchanglespeedchart);
  yield takeLatest(singleDeviceCurveAction.getwinddistributionchart, getwinddistributionchart);
  yield takeLatest(singleDeviceCurveAction.getsequencechart, getsequencechart);
  yield takeLatest(singleDeviceCurveAction.getDeviceInfo, getDeviceInfo);


}
