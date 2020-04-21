import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { powerCurveAction } from './powerCurveAction';
import moment from 'moment';

function* changePowerCurveStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: powerCurveAction.changePowerCurveStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: powerCurveAction.RESET_STORE
  })
}

function* getPowerList(action) { // 请求功率曲线列表
  const { payload } = action;
  // const url = '/mock/system/alarmManage/alarmList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPowercurveList}`
  try {
    yield put({ type: powerCurveAction.powerCurveFetch });
    let sortMethod = payload.sortMethod;
    if (payload && payload.sortField === 'air_density_type') { // 空气密度类型的排序展示 需要反着请求 现场和标准的原因 
      sortMethod = payload.sortMethod === 'DESC' ? 'ASC' : 'DESC';
    }
    const response = yield call(axios.post, url, {
      ...payload,
      sortMethod,
    });
    if (response.data.code === '10000') {
      const totalNum =  response.data.data && response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if (totalNum === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: powerCurveAction.powerCurveFetchSuccess,
        payload: {
          ...payload,
          powerList: response.data.data.detailData || [],
          totalNum: response.data.data.total || 0,
          pageNum,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: powerCurveAction.changePowerCurveStore,
      payload: { ...payload, loading: false },
    })
  }
}

function* importCurveExcel(action) { // 导入功率曲线
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.importPowercurve}`
  try {
    yield put({ type: powerCurveAction.powerCurveFetch });
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false,  // 不处理数据
      contentType: false   // 不设置内容类型
    });
    if (response.data.code === '10000') {
      message.success(`文件上传成功`);
      // yield put({ type: powerCurveAction.powerCurveFetchSuccess });
      const params = yield select(state =>({//继续功率曲线列表
            stationCode: state.system.powerCurve.get('stationCode'),
            deviceModeCode: state.system.powerCurve.get('deviceModeCode'),
            sortField: state.system.powerCurve.get('sortField'),
            sortMethod: state.system.powerCurve.get('sortMethod'),
            pageNum: state.system.powerCurve.get('pageNum'),
            pageSize: state.system.powerCurve.get('pageSize'),
          })
      );
      yield put({
        type: powerCurveAction.getPowercurveDetail,
        payload: params,
      });
    } else {
      message.success(`文件上传失败`);
      yield put({
        type: powerCurveAction.changePowerCurveStore,
        payload: { loading: false },
      })
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: powerCurveAction.changePowerCurveStore,
      payload: { loading: false },
    })
  }
}


function* downloadCurveExcel(action) { // 导出功率曲线
  const { payload } = action;
  try {
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.downloadPowercurve}`
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload,
      responseType: 'blob',
    });
    const date = moment().format('YYYYMMDD')
    if (response.data) {
      const content = response.data;
      const blob = new Blob([content]);

      const fileName = `功率曲线信息表${date}.xlsx`;
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    }
  } catch (e) {
    console.log(e);
    message.error(`导出功率曲线失败!${e}`)
  }
}


function* getPowercurveDetail(action) { // 请求功率曲线列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPowercurveDetail}`
  try {
    yield put({ type: powerCurveAction.powerCurveFetch });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: powerCurveAction.powerCurveFetchSuccess,
        payload: {
          powercurveDetail: response.data.data || [],
        },
      });
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: powerCurveAction.changePowerCurveStore,
      payload: { ...payload, loading: false },
    })
  }
}

function* downloadStandardCurveExcel() { // 导出功率下载模版
  try {
    const url = `${Path.basePaths.originUri}/template/PowerCurve.xlsx`
    const response = yield call(axios, {
      method: 'get',
      url,
      responseType: 'blob',
    });
    if (response.data) {
      const content = response.data;
      const blob = new Blob([content]);

      const fileName = `标准功率曲线数据表.xlsx`;
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    }
  } catch (e) {
    console.log(e);
    message.error(`导出标准功率曲线数据表!${e}`)
  }
}




export function* watchPowerCurve() {
  yield takeLatest(powerCurveAction.changePowerCurveStoreSaga, changePowerCurveStore);
  yield takeLatest(powerCurveAction.resetStore, resetStore);
  yield takeLatest(powerCurveAction.getPowerList, getPowerList);
  yield takeLatest(powerCurveAction.downloadCurveExcel, downloadCurveExcel);
  yield takeLatest(powerCurveAction.getPowercurveDetail, getPowercurveDetail);
  yield takeLatest(powerCurveAction.downloadStandardCurveExcel, downloadStandardCurveExcel);
  yield takeLatest(powerCurveAction.importCurveExcel, importCurveExcel);
}

