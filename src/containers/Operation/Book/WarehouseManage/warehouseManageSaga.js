import {put, takeLatest, call} from 'redux-saga/effects';
import { warehouseManageAction } from './warehouseManageReducer';
import path from '../../../../constants/path';
import axios from 'axios';
const { APIBasePath, APISubPaths } = path;
const { operation } = APISubPaths;

function* getGoodsUpdateList(action) {
  const url = `${APIBasePath}${operation}`;
  try {
    console.log('try')
  } catch (e) {
    console.log(e);
  }
}

export function* watchWarehouseManage() {
  // yield takeLatest(warehouseAction.getWarehouseList, getWarehouseList);
  // yield takeLatest(warehouseAction.getWarehouseAddList, getWarehouseAddList);
  // yield takeLatest(warehouseAction.getWarehouseDelList, getWarehouseDelList);
  // yield takeLatest(warehouseAction.getWarehouseUpdateList, getWarehouseUpdateList);
  // yield takeLatest(warehouseAction.getGoodsList, getGoodsList);
  // yield takeLatest(warehouseAction.getGoodsAddList, getGoodsAddList);
  // yield takeLatest(warehouseAction.getGoodsDelList, getGoodsDelList);
  // yield takeLatest(warehouseAction.getGoodsUpdateList, getGoodsUpdateList);
}

