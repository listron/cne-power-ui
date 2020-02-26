import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { meterReadSetAction } from './meterReadSetAction';
import { func } from 'prop-types';
const { APIBasePath } = Path.basePaths;
const { operation } = Path.APISubPaths;

function *getMeterList({ payload = {} }){ // 获取抄表设置列表
  const { stationCode } = payload;
  const url = `${APIBasePath}${operation.getMeterList}/${stationCode}`;
  try{
    yield put({
      type: meterReadSetAction.changeMeterReadSetStore,
      payload: { tableLoading: true},
    });
    if (stationCode) {
      const response = yield call(axios.get, url);
      if (response.data.code === '10000') {
        yield put({
          type: meterReadSetAction.changeMeterReadSetStore,
          payload: {
            tableLoading: false,
            meterListError: false,
            meterListData: response.data.data || [],
          },
        });
      }
    }
    if (!stationCode) {
      yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload: {
          tableLoading: false,
          meterListError: false,
          meterListData: [],
        },
      });
    }
  } catch(error){
    yield put({
      type: meterReadSetAction.changeMeterReadSetStore,
      payload: {
        tableLoading: false,
        meterListError: true,
        meterListData: [],
      },
    });
    console.log(error);
    message.error('获取抄表设置列表失败');
  }
}

function *getAddMeterList({ payload = {} }){ // 新增列表行
  const { func, ...rest } = payload;
  const url = `${APIBasePath}${operation.getAddMeterList}`;
  try{
    const response = yield call(axios.post, url, rest);
    if (response.data.code === '10000') {
      message.success('添加成功');
      const params = yield select(state => state.operation.meterReadSet.get('stationCode'));
      func();
      yield put({
        type: meterReadSetAction.getMeterList,
        payload: { stationCode: params },
      });
    } else { throw response.data; }
  } catch(error) {
    console.log(error);
    message.error('新增失败');
  }
}

function *getUpDateMeterList({ payload = {} }){ // 修改列表
  const { func, ...rest } = payload;
  const url = `${APIBasePath}${operation.getUpDateMeterList}`;
  try{
    yield put({
      type: meterReadSetAction.changeMeterReadSetStore,
      payload: { tableLoading: true },
    });
    const response = yield call(axios.post, url, rest);
    if (response.data.code === '10000') {
      message.success('编辑成功');
      const params = yield select(state => state.operation.meterReadSet.get('stationCode'));
      func();
      yield put({
        type: meterReadSetAction.getMeterList,
        payload: {
          stationCode: params,
          tableLoading: false,
        },
      });
    } else{ throw response.data; }
  } catch(error){
    console.log(error);
    message.error('修改失败');
    yield put({
      type: meterReadSetAction.changeMeterReadSetStore,
      payload: {
        tableLoading: false,
      },
    });
  }
}

function *getDeleteMeterList({ payload = {} }){ // 删除列表
  const { meterId } = payload;
  const url = `${APIBasePath}${operation.getDeleteMeterList}/${meterId}`;
  try{
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const params = yield select(state => state.operation.meterReadSet.get('stationCode'));
      yield put({
        type: meterReadSetAction.getMeterList,
        payload: {stationCode: params},
      });
    } else{
      message.error(response.data.message);
      throw response.data;
    }
  } catch(error){
    console.log(error);
    message.error('删除失败');
  }
}

function *getChangeMeterList({ payload = {} }){ // 换表
  const url = `${APIBasePath}${operation.getChangeMeterList}`;
  try{
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
    yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload,
      });
    }else {
      message.error(response.data.message);
      throw response.data;
    }
  }catch(error){
    console.log(error);
    message.error('换表失败');
  }
}

function *getBaseDevice({ payload = {} }){ // 电表设置-电表名称下拉框列表
  const { stationCode } = payload;
  const url = `${APIBasePath}${operation.getBaseDevice}/${stationCode}/505`; // 要获取的设备类型是电能采集（505）
  try{
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload: {
          baseDeviceData: response.data.data || [],
        },
      });
    }else{
      message.error(response.data.message);
      throw response.data;
    }
  } catch(error){
    console.log(error);
    message.error('获取电表名称失败');
  }
}

function *getPriceDetail({ payload = {} }){ // 查看电价详情
  const { stationCode } = payload;
  const url = `${APIBasePath}${operation.getPriceDetail}/${stationCode}`;
  try{
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload: {
          priceDetailData: response.data.data || {},
        },
      });
    }else{
      message.error('查看电价详情失败');
      yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload: {
          priceDetailData: {},
        },
      });
    }
  } catch(error){
    console.log(error);
    message.error('查看电价详情失败');
  }
}

function *getMeterPrice({ payload = {} }){ // 编辑电价
  const url = `${APIBasePath}${operation.getMeterPrice}`;
  try{
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('编辑成功');
      const params = yield select(state => state.operation.meterReadSet.get('stationCode'));
      yield put({
        type: meterReadSetAction.getPriceDetail,
        payload: {stationCode: params},
      });
    }else{
      message.error(response.data.message);
      throw response.data;
    }
  }catch(error){
    console.log(error);
    message.error('编辑电价详情失败');
  }
}

export function* wacthMeterReadSet() {
  yield takeLatest(meterReadSetAction.getMeterList, getMeterList);
  yield takeLatest(meterReadSetAction.getUpDateMeterList, getUpDateMeterList);
  yield takeLatest(meterReadSetAction.getDeleteMeterList, getDeleteMeterList);
  yield takeLatest(meterReadSetAction.getChangeMeterList, getChangeMeterList);
  yield takeLatest(meterReadSetAction.getBaseDevice, getBaseDevice);
  yield takeLatest(meterReadSetAction.getPriceDetail, getPriceDetail);
  yield takeLatest(meterReadSetAction.getAddMeterList, getAddMeterList);
  yield takeLatest(meterReadSetAction.getMeterPrice, getMeterPrice);
}
