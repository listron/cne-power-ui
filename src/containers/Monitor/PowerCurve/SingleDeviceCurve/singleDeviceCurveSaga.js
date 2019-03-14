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
  const powercurveUrl = `/mock/wind/powercurve/fan/powercurvechart`;
  // const powercurveUrl = `${APIBasePath}${monitor.getSingleDeviceCurveData}`;
 
  const response = yield call(axios.post, powercurveUrl, payload);
  try {
    if (response.data.code === '10000') {
      yield put({
        type:singleDeviceCurveAction.PERFORMANCEANALYSIS_FETCH ,
        payload: {
          singleDeviceCurveData: response.data.data || {},
        }
      })
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
    const url = `${APIBasePath}${monitor.getSingleDeviceCurveList}`
    const response = yield call(axios.post, url);
    const total = response.data.data.pageCount || 0;
    let { pageNum, pageSize } = payload;
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
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取单设备功率曲线列表失败!');
    console.log(error);
  }
}
function* exportSinglePowerdevice(action) { //导出
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.exportPowerdevice}`
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          exportData: response.data.data || {},
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
function* getRoseChart(action) { //功率曲线图表-风向玫瑰图-单风机
  const { payload } = action;
  const RoseChartUrl = `/mock/wind/powercurve/fan/windrosechart`;
  // const RoseChartUrl = `${APIBasePath}${monitor.getRoseChart}`;

  // const powerspeedUrl = `${APIBasePath}${monitor.getpowerspeedchart}`;
  // const changlespeedUrl = `${APIBasePath}${monitor.getpitchanglespeedchart}`;
  // const winddistributionUrl = `${APIBasePath}${monitor.getwinddistributionchart}`;
  // const sequencechartUrl = `${APIBasePath}${monitor.getsequencechart}`;
  try {
    // const response = yield call(axios.post, RoseChartUrl, payload);
    const [rose,powerspeed,changlespeed,winddistribution,sequencechart] = yield all([
      call(axios.get,RoseChartUrl,{...payload}),
      // call(axios.post,powerspeedUrl,{...payload}),
      // call(axios.post,changlespeedUrl,{...payload}),
      // call(axios.post,winddistributionUrl,{...payload}),
      // call(axios.post,sequencechartUrl,{...payload}),
    ]);

    if (rose.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          roseChartData: rose.data.data || [],
        }
      })
    }
    // if (powerspeed.data.code === '10000') {
    //   yield put({
    //     type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
    //     payload: {
    //       powerspeedchartData: powerspeed.data.data || [],
    //     }
    //   })
    // } 
    // if (changlespeed.data.code === '10000') {
    //   yield put({
    //     type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
    //     payload: {
    //       pitchanglespeedchartData: changlespeed.data.data || [],
    //     }
    //   })
    // } 
    // if (winddistribution.data.code === '10000') {
    //   yield put({
    //     type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
    //     payload: {
    //       winddistributionchartData: winddistribution.data.data || [],
    //     }
    //   })
    // } 
    // if (sequencechart.data.code === '10000') {
    //   yield put({
    //     type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
    //     payload: {
    //       sequencechartData: sequencechart.data.data ||[],
    //     }
    //   })
    // } 
  } catch (error) {
    message.error('获取功率曲线图表-风向玫瑰图-单风机失败!');
    console.log(error);
  }
}
function* getpowerspeedchart(action) { //功率曲线图表-功率&转速-单风机
  const { payload } = action;
  try {
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getpowerspeedchart}`
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          powerspeedchartData: response.data.data || {},
        }
      })
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
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getpitchanglespeedchart}`
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          pitchanglespeedchartData: response.data.data || {},
        }
      })
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
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getwinddistributionchart}`
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          winddistributionchartData: response.data.data || {},
        }
      })
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
    // const url = '/mock/monitor/dataAnalysisSecendInteral'; 
    const url = `${APIBasePath}${monitor.getsequencechart}`
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      yield put({
        type: singleDeviceCurveAction.GET_SINGLE_DEVICECURVE_SUCCESS,
        payload: {
          sequencechartData: response.data.data || {},
        }
      })
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
  yield takeLatest(singleDeviceCurveAction.exportSinglePowerdevice, exportSinglePowerdevice);
  yield takeLatest(singleDeviceCurveAction.getRoseChart, getRoseChart);
  yield takeLatest(singleDeviceCurveAction.getpowerspeedchart, getpowerspeedchart);
  yield takeLatest(singleDeviceCurveAction.getpitchanglespeedchart, getpitchanglespeedchart);
  yield takeLatest(singleDeviceCurveAction.getwinddistributionchart, getwinddistributionchart);
  yield takeLatest(singleDeviceCurveAction.getsequencechart, getsequencechart);


}
