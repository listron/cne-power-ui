import { call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../../constants/path';
import { scatterDiagramAction } from './scatterDiagramReducer';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

function *getPoints({ payload = {} }) { // 获取设备测点
  const { deviceFullCode = [] } = payload;
  try {
    const deviceInfo = deviceFullCode[0] || {};
    const url = `${APIBasePath}${monitor.getPoints}/${deviceInfo.deviceCode}`;
    const { logPointX, logPointY, queryParam } = yield select(state => state.monitor.dataScatterDiagram.toJS());
    yield put({ // 相关请求参数缓存，并保留选中的测点信息。
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: {
        queryParam: {
          ...queryParam,
          deviceFullCode
        },
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      let xPoint, yPoint;
      const pointsInfo = response.data.data || [];
      if (logPointX) { // 上次请求的x优先进行选择
        const tmpPointX = pointsInfo.find(e => e.devicePointCode === logPointX) || {};
        xPoint = tmpPointX.devicePointCode || null;
      }
      if (logPointY) { // 上次请求的x优先进行选择
        const tmpPointY = pointsInfo.find(e => e.devicePointCode === logPointY) || {};
        yPoint = tmpPointY.devicePointCode || null;
      }
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          queryParam: {
            ...queryParam,
            deviceFullCode,
            xPoint,
            yPoint,
          },
          pointsInfo,
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取测点信息失败!');
    console.log(error);
  }
}

function *getListScatterDiagram({ payload = {} }) { // 获取表格数据
  const { queryParam, listParam } = payload;
  const url = `${APIBasePath}${monitor.getListScatterDiagram}`;
  try{
    const { startTime, endTime, stationCode, deviceFullCode, xPoint, yPoint } = queryParam;
    const stationInfo = stationCode[0] || {};
    const deviceInfo = deviceFullCode[0] || {};
    yield put({ // 相关请求参数缓存，并保留选中的测点信息。
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: {
        queryParam,
        listParam,
        logPointX: xPoint,
        logPointY: yPoint,
        tableLoading: true
      }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      stationCode: stationInfo.stationCode,
      deviceFullCode: deviceInfo.deviceCode,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
    });
    const { totalSize = 0 } = response.data.data;
    let { pageNum, pageSize } = listParam;
    const maxPage = Math.ceil(totalSize / pageSize);
    if (totalSize === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          listParam: {
            ...listParam,
            pageNum, 
            pageSize
          },
          tableLoading: false,
          scatterDiagramList: response.data.data || {},
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { tableLoading: false }
    })
    console.log(e);
  }
}

function *getChartScatterDiagram({ payload = {} }){ // 获取散点图echarts数据
  const { queryParam } = payload;
  const url = `${APIBasePath}${monitor.getAllScatterDiagram}`; 
  try{
    const { startTime, endTime, stationCode, deviceFullCode } = queryParam;
    const stationInfo = stationCode[0] || {};
    const deviceInfo = deviceFullCode[0] || {};
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { 
        chartLoading: true,
        chartTime: null, 
       }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      stationCode: stationInfo.stationCode,
      deviceFullCode: deviceInfo.deviceCode,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
    });
    if (response.data.code === '10000') {
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload:{
          chartTime: moment().unix(), 
          scatterDiagramCharts: response.data.data || [],
          chartLoading: false
        }
      });
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error("获取图表数据失败!");
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { tableLoading: false, chartTime: moment().unix(),  }
    })
    console.log(e);
  }
}

export function* watchDataScatterDiagramMonitor() {
  yield takeLatest(scatterDiagramAction.getPoints, getPoints);
  yield takeLatest(scatterDiagramAction.getListScatterDiagram, getListScatterDiagram);
  yield takeLatest(scatterDiagramAction.getChartScatterDiagram, getChartScatterDiagram);
}