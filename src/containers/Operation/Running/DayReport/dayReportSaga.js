import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dayReportAction } from './dayReportAction';
const { APIBasePath } = Path.basePaths;
const { operation } = Path.APISubPaths;

function *toChangeDayReportStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  dayReportAction.changeDayReportStore,
    payload,
  })
}

function *getDayReportList(action){//请求日报基本列表数据
  const { payload } = action;
  const url = '/mock/operation/dayReport/list';
  // const url = `${APIBasePath}${operation.getDayReportList}`
  try{
    yield put({ type:dayReportAction.dayReportLoading });
    const response = yield call(axios.post,url,payload);
    const totalNum = response.data.data.total || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 0;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }
    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        ...payload,
        dayReportList: response.data.data.list || [],
        totalNum,
        pageNum
      },
    });
  }catch(e){
    console.log(e);
    message.error('获取日报列表失败，请重试');
    yield put({
      type:  dayReportAction.changeDayReportStore,
      payload:{
        loading: false,
        dayReportList: [],
      },
    });
  }
}

function *getStationBaseReport(action){ // 选中日期+电站后各待上传数据电站基础情况
  const { payload } = action;
  const { reportStation, reportDay } = payload
  // const url = '/mock/operation/dayReport/baseInfo';
  const url = `${APIBasePath}${operation.getStationBaseReport}`;
  try{
    const response = yield call(axios.post,url,{
      reportDay,
      stationCode: reportStation.map(e=>`${e.stationCode}`)
    });
    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        showPage: 'report',
        reportDay,
        reportStation,
        stationReportBaseData: response.data.data || [],
        showReportInputList: true,
      },
    });
  }catch(e){
    console.log(e);
    message.error('获取电站基础数据失败，请重试');
    yield put({
      type:  dayReportAction.changeDayReportStore,
      payload:{
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
    const response = yield call(axios.get,url);
    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        dayReportConfig: response.data.data || [],
      },
    });
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
    const response = yield call(axios.get,url);
    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        reportDisableStation: response.data.data || [],
        reportDay,
        reportStation: [], // 清空已选电站
      },
    });
  }catch(error){
    message.error('获取已上传日报的电站列表失败，请重试');
    console.log(error);
    yield put({
      type:  dayReportAction.changeDayReportStore,
      payload:{
        reportDay: payload.reportDay,
      },
    });
  }
}

function *dayReportDetail(action){ // 日报详情
  const { payload } = action;
  try{
    yield put({ type:dayReportAction.dayReportLoading });
    const { stationCode, reportDate } = payload;
    const url = '/mock/operation/dayReport/detail';
    // const url = `${APIBasePath}${operation.dayReportDetail}/${stationCode}/${reportDate}`;
    const response = yield call(axios.get,url);
    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        showPage: 'detail',
        selectedDayReportDetail: response.data.data || {}
      },
    });
  }catch(e){
    console.log(e);
    message.error('获取详情失败，请重试');
    yield put({
      type:  dayReportAction.changeDayReportStore,
      payload:{
        loading: false,
        selectedDayReportDetail: {},
      },
    });
  }
}

function *dayReportUpdate(action){ // 日报编辑
  const { payload } = action;
  try{
    yield put({ type:dayReportAction.dayReportLoading });
    const url = '/mock/operation/dayReport/update';
    // const url = `${APIBasePath}${operation.dayReportUpdate}`;
    const response = yield call(axios.put,url, payload);
    if(response.data.code === '10000'){
      //重新请求列表 - todo
      yield put({
        type:  dayReportAction.dayReportFetchSuccess,
        payload:{ },
      });
    }
  }catch(e){
    console.log(e);
    message.error('获取详情失败，请重试');
    yield put({
      type:  dayReportAction.changeDayReportStore,
      payload:{
        loading: false,
        selectedDayReportDetail: {},
      },
    });
  }
}


export function* watchDayReport() {
  yield takeLatest(dayReportAction.toChangeDayReportStore, toChangeDayReportStore);
  yield takeLatest(dayReportAction.getDayReportList, getDayReportList);
  yield takeLatest(dayReportAction.getDayReportConfig, getDayReportConfig);
  yield takeLatest(dayReportAction.getStationBaseReport, getStationBaseReport);
  yield takeLatest(dayReportAction.getReportUploadedStation, getReportUploadedStation);
  yield takeLatest(dayReportAction.dayReportDetail, dayReportDetail);
  yield takeLatest(dayReportAction.dayReportUpdate, dayReportUpdate);
}

