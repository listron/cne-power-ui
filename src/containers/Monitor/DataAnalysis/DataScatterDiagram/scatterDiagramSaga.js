import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { scatterDiagramAction } from './scatterDiagramAction';
import { message } from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getPointInfo({payload = {} }) { // 获取可选测点
  const { deviceFullCode } = payload;
  try {
    const url = '/mock/monitor/dataAnalysis/dataAnalysisPoints';    // `${APIBasePath}${monitor.getXYaxis}/${deviceFullCode[0].deviceCode}`; 
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          xPointList: response.data.data.xPoint || [],
          yPointList: response.data.data.yPoint || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const { queryParam } = yield select(state => state.monitor.dataScatterDiagram.toJS());
    const url = '/mock/monitor/dataAnalysisSecendInteral';
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [1, 5 ,10] : [5 ,10],
          queryParam: {
            ...queryParam,
            timeInterval: hasSecond === 1 ? 1 : 5,
          }
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取企业数据时间间隔信息失败!');
    console.log(error);
  }
}

function *getListScatterDiagram(action) { // 获取表格数据
  const { payload } = action;
  const { queryParam, listParam } = payload;
  const url = '/mock/monitor/dataAnalysis/listScatterDiagram';
  try{
    const { startTime, endTime, deviceFullCode } = queryParam;
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { queryParam, listParam, tableLoading: true }
    })
    
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      deviceFullCode: deviceFullCode.map(e => e.deviceCode),
      startTime: startTime.utc().format(),
      endTime: endTime.utc().format(),
      enterpriseId: Cookie.get('enterpriseId'),
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
          partScatterDiagram: response.data.data || {},
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

function *getChartScatterDiagram(action){ // 获取散点图echarts数据
  const { payload } = action;
  const { queryParam } = payload;
  console.log(payload);

  const url = '/mock/monitor/dataAnalysis/allScatterDiagram';
  try{
    const {  startTime, endTime, deviceFullCode } = queryParam;
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { queryParam, chartLoading: true }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      deviceFullCode: deviceFullCode.map(e => e.deviceCode),
      startTime: startTime.utc().format(),
      endTime: endTime.utc().format(),
      enterpriseId: Cookie.get('enterpriseId'),
    });
    if(response.data.data === '10000'){

      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          chartTime: moment().unix(), 
          allscatterDiagram: response.data.data || {},
          chartLoading: false
        }
      })
    }else{
      throw response.data;
    }
  }catch(e){
    message.error('获取图表数据失败!');
    yield put({
      type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,
      payload: { chartLoading: false }
    })

    console.log(e);
  }
}



export function* watchDataScatterDiagramMonitor() {
  yield takeLatest(scatterDiagramAction.getSecendInterval, getSecendInterval);
  yield takeLatest(scatterDiagramAction.getPointInfo, getPointInfo);
  yield takeLatest(scatterDiagramAction.getListScatterDiagram, getListScatterDiagram);
  yield takeLatest(scatterDiagramAction.getChartScatterDiagram, getChartScatterDiagram);
}