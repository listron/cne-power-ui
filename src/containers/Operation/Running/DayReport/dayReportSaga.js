import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dayReportAction } from './dayReportAction';
const { APIBasePath } = Path.basePaths;
const { operation } = Path.APISubPaths;

function *toChangeDayReportStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: dayReportAction.changeDayReportStore,
    payload,
  });
}

function *resetStore(){
  yield put({
    type: dayReportAction.RESET_STORE,
  });
}

function *getDayReportList(action){//请求日报基本列表数据
  const { payload } = action;
  // const url = '/mock/operation/dayReport/list';
  const url = `${APIBasePath}${operation.getDayReportList}`;
  try{
    yield put({ type: dayReportAction.dayReportLoading });
    const response = yield call(axios.post, url, payload);
    const totalNum = response.data.data.total || 0;
    let { pageNum } = payload;
    const { pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }
    if(response.data.code === '10000'){
      yield put({
        type: dayReportAction.dayReportFetchSuccess,
        payload: {
          ...payload,
          dayReportList: response.data.data.list || [],
          totalNum,
          pageNum,
        },
      });
    }else{
      message.error('获取日报列表失败，请重试');
      yield put({
        type: dayReportAction.changeDayReportStore,
        payload: {
          loading: false,
          dayReportList: [],
        },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取日报列表失败，请重试');
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: {
        loading: false,
        dayReportList: [],
      },
    });
  }
}

function *getStationBaseReport(action){ // 选中日期+电站后各待上传数据电站基础情况
  const { payload } = action;
  const { reportStation, reportDay } = payload;
  // const url = '/mock/operation/dayReport/baseInfo';
  const url = `${APIBasePath}${operation.getStationBaseReport}`;
  try{
    const response = yield call(axios.post, url, {
      reportDate: reportDay,
      stationCode: reportStation.map(e=>`${e.stationCode}`),
    });
    if(response.data.code === '10000'){
      yield put({
        type: dayReportAction.dayReportFetchSuccess,
        payload: {
          showPage: 'report',
          reportDay,
          reportStation,
          stationReportBaseData: response.data.data || [],
          showReportInputList: true,
        },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取电站基础数据失败，请重试');
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: {
        loading: false,
        stationReportBaseData: [],
      },
    });
  }
}

function *getDayReportConfig(action){ // 日报必填项配置
  const { payload } = action;
  try{
    const { enterpriseId, module, type} = payload;
    // const url = '/mock/operation/dayReport/config';
    const url = `${APIBasePath}${operation.getDayReportConfig}/${enterpriseId}/${module}/${type}`;
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: dayReportAction.dayReportFetchSuccess,
        payload: {
          dayReportConfig: response.data.data || [],
        },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取日报配置信息失败，请刷新重试');
  }
}

function *getReportUploadedStation(action){ // 选定日期已上传过日报电站编码获取
  const { payload } = action;
  try{
    const { reportDay } = payload;
    // const url = '/mock/operation/dayReport/getReportUploadedStation';
    const url = `${APIBasePath}${operation.getReportUploadedStation}/${reportDay}`;
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: dayReportAction.dayReportFetchSuccess,
        payload: {
          reportDisableStation: response.data.data.map(e=>parseInt(e, 10)) || [],
          reportDay,
          reportStation: [], // 清空已选电站
        },
      });
    }
  }catch(error){
    message.error('获取已上传日报的电站列表失败，请重试');
    console.log(error);
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: {
        reportDisableStation: [],
        reportDay: payload.reportDay,
      },
    });
  }
}

function *uploadDayReport(action){ // 日报上报
  const { payload } = action;
  // const url = '/mock/operation/dayReport/uploadDayReport';
  const url = `${APIBasePath}${operation.uploadDayReport}`;
  try{
    yield put({ type: dayReportAction.dayReportLoading });
    const response = yield call(axios.post, url, payload);
    const { code } = response.data;
    if(code === '10000' || code === '10001'){ // 日报上报成功
      if(code === '10001'){ // 10001 多电站上报中，有某几个电站已上传过该日日报，提示。
        message.config(response.data.message);
      }
      const params = yield select(state => ({ // 重新请求日报列表
        startTime: state.operation.dayReport.get('startTime'),
        pageSize: state.operation.dayReport.get('pageSize'),
        pageNum: state.operation.dayReport.get('pageNum'),
        stationNameSort: state.operation.dayReport.get('stationNameSort'),
        stationType: state.operation.dayReport.get('stationType'),
        regionName: state.operation.dayReport.get('regionName'),
      }));
      yield put({ // 清空缓存的相关数据
        type: dayReportAction.changeDayReportStore,
        payload: {
          showPage: 'list',
          stationReportBaseData: [],
          reportDay: '',
          reportStation: [],
          showReportInputList: false,
        },
      });
      yield put({
        type: dayReportAction.getDayReportList,
        payload: { ...params },
      });
    }else{
      message.error(`日报上报失败!${response.data.message}`);
      yield put({
        type: dayReportAction.changeDayReportStore,
        payload: { loading: false },
      });
    }
  }catch(e){
    console.log(e);
    message.error('日报上报失败!');
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: { loading: false },
    });
  }
}

function *dayReportDetail(action){ // 日报详情
  const { payload } = action;
  try{
    yield put({ type: dayReportAction.dayReportLoading });
    const { stationCode, reportDate } = payload;
    // const url = '/mock/operation/dayReport/detail';
    const url = `${APIBasePath}${operation.dayReportDetail}/${stationCode}/${reportDate}`;
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: dayReportAction.dayReportFetchSuccess,
        payload: {
          showPage: 'detail',
          selectedDayReportDetail: response.data.data || {},
        },
      });
    }else{
      message.error('获取详情失败，请重试');
      yield put({
        type: dayReportAction.changeDayReportStore,
        payload: {
          loading: false,
          selectedDayReportDetail: {},
        },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取详情失败，请重试');
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: {
        loading: false,
        selectedDayReportDetail: {},
      },
    });
  }
}

function *dayReportUpdate(action){ // 日报编辑
  const { payload } = action;
  const { stationCode, reportDate } = payload;
  try{
    yield put({ type: dayReportAction.dayReportLoading });
    // const url = '/mock/operation/dayReport/update';
    const url = `${APIBasePath}${operation.dayReportUpdate}`;
    const response = yield call(axios.put, url, payload);
    if(response.data.code === '10000'){ // 日报编辑成功，重新请求日报列表，返回详情页，并重新请求详情
      const params = yield select(state => ({
        startTime: state.operation.dayReport.get('startTime'),
        pageSize: state.operation.dayReport.get('pageSize'),
        pageNum: state.operation.dayReport.get('pageNum'),
        stationNameSort: state.operation.dayReport.get('stationNameSort'),
        stationType: state.operation.dayReport.get('stationType'),
        regionName: state.operation.dayReport.get('regionName'),
      }));
      yield put({ // 请求请求详情页数据
        type: dayReportAction.dayReportDetail,
        payload: { stationCode, reportDate },
      });
      yield put({ // 重新请求日报列表
        type: dayReportAction.getDayReportList,
        payload: { ...params },
      });
    }else{
      message.error(`日报编辑失败!${response.data.message}`);
      yield put({
        type: dayReportAction.changeDayReportStore,
        payload: { loading: false },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取详情失败，请重试');
    yield put({
      type: dayReportAction.changeDayReportStore,
      payload: {
        loading: false,
        selectedDayReportDetail: {},
      },
    });
  }
}


export function* watchDayReport() {
  yield takeLatest(dayReportAction.toChangeDayReportStore, toChangeDayReportStore);
  yield takeLatest(dayReportAction.resetStore, resetStore);
  yield takeLatest(dayReportAction.getDayReportList, getDayReportList);
  yield takeLatest(dayReportAction.getDayReportConfig, getDayReportConfig);
  yield takeLatest(dayReportAction.getStationBaseReport, getStationBaseReport);
  yield takeLatest(dayReportAction.getReportUploadedStation, getReportUploadedStation);
  yield takeLatest(dayReportAction.uploadDayReport, uploadDayReport);
  yield takeLatest(dayReportAction.dayReportDetail, dayReportDetail);
  yield takeLatest(dayReportAction.dayReportUpdate, dayReportUpdate);
}

