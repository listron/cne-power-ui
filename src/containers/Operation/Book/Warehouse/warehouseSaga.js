import {put, takeEvery, call} from 'redux-saga/effects';
import { warehouseAction } from './warehouseAction';
import Path from "../../../../constants/path";
import axios from "axios";

/***
 * 解析公共头APIBasePath
 * operation下面的接口
 */

const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    operation: {
      warehouseList,
      warehouseAdd,
      warehouseDel
    }
  }} = Path;

function* getWarehouseList(action) { // 仓库列表分页查询 || 模糊搜索
  const { payload } = action;
  const url = `${APIBasePath}${warehouseList}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
        pageSize: payload.pageSize || 10,
        pageNum: payload.pageNum || 1,
        warehouseName: payload.warehouseName,
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseAction.warehouseFetchSuccess,
        payload: {
          warehouseData: response.data.data || {},
          loading: false,
        },
      });
    }else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: false
      }
    });
  }
}

function* getWarehouseAddList(action) { // 仓库添加
  const {
    payload: {
      func,
      warehouseName,
      stationCodes
    }
  } = action;
  // 添加的参数
  const paramsAdd = {
    warehouseName,
    stationCodes
  };
  const url = `${APIBasePath}${warehouseAdd}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
      }
    });
    const response = yield call(axios.post, url, paramsAdd);
    if (response.data.code === '10000') {
      // 添加完之后在调用仓库列表
      const paramsList = {
        warehouseName: "",
        pageNum: 1,
        pageSize: 10
      };
      // 添加成功清空input的值
      func();
      yield put({
        type: warehouseAction.getWarehouseList,
        payload: paramsList,
      });
    }else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: false
      }
    });
  }
}

function* getWarehouseDelList(action) { // 仓库删除
  const {
    payload: {
      warehouseIds,
      warehouseName,
      pageNum,
      pageSize,
      func
    }
  } = action;
  const url = `${APIBasePath}${warehouseDel}?warehouseIds=${warehouseIds}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
      }
    });
    const response = yield call(axios.delete, url);
    if (response.data.code === '10000') {
      // 删除完之后在调用仓库列表
      const paramsList = {
        warehouseName,
        pageNum,
        pageSize
      };
      // 删除成功之后关闭
      func();
      yield put({
        type: warehouseAction.getWarehouseList,
        payload: paramsList,
      });
    }else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: false
      }
    });
  }
}

export function* watchWarehouse() {
  yield takeEvery(warehouseAction.getWarehouseList, getWarehouseList);
  yield takeEvery(warehouseAction.getWarehouseAddList, getWarehouseAddList);
  yield takeEvery(warehouseAction.getWarehouseDelList, getWarehouseDelList);

}

