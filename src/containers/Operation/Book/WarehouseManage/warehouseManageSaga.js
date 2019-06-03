import { put, takeLatest, select, call, fork } from 'redux-saga/effects';
import { warehouseManageAction } from './warehouseManageReducer';
import path from '../../../../constants/path';
import axios from 'axios';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

const stockTypeCodes = {
  spares: 101,
  tools: 200,
  materials: 300
}

function* getWarehouses() {
  const url = `${APIBasePath}${operation.getWarehouses}`;
  try {
    const response =  yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { warehouseList: response.data.data || [] }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { warehouseList: [] }
    })
  }
}

function* getManufactures() {
  const url = `${APIBasePath}${operation.getManufactures}`;
  try {
    const response =  yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { manufacturerList: response.data.data || [] }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { manufacturerList: [] }
    })
  }
}

function* getModes({ payload = {} }) {
  const { selectedManufacturer } = payload;
  const url = `${APIBasePath}${operation.getModes}/${selectedManufacturer}/modes`;
  try {
    const response =  yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { modeList: response.data.data || [] }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { modeList: [] }
    })
  }
}

function *getWarehouseManageList({ payload = {} }) {
  const url = `${APIBasePath}${operation.getWarehouseManageList}`;
  try {
    const { tabName } = yield select(state => state.operation.warehouseManage.toJS());
    const response = yield call(axios.post, url, {
      warehouseId: payload.selectedWarehouse,
      manufactorId: payload.selectedManufacturer,
      modeId: payload.selectedMode,
      goodsMaxType: stockTypeCodes[tabName],
      pageNum: payload.pageNum,
      pageSize: payload.pageSize,
      sortField: payload.sortField,
      sortMethod: payload.sortMethod,
    });
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          stocksList: response.data.data.dataList || {},
          totalCount: response.data.data.pageCount || 0
        }
      })
    } else { throw response.data }
  } catch (error) {
    console.log(error);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { stocksList: [], totalCount: 0 }
    })
  }
}

function *deleteWarehouseMaterial({ payload }) {
  const url = `${APIBasePath}${operation.deleteWarehouseMaterial}`;
  try {
    const { tabName, tableParams } = yield select(state => state.operation.warehouseManage.toJS());
    const { stocksList = [] } = payload;
    const response = yield call(axios.post, url, {
      goodsMaxType: stockTypeCodes[tabName],
      inventoryIds: stocksList.map(e => e.inventoryId).join(','),
    })
    if (response.data.code === '10000') { // 删除成功后重新请求列表数据
      yield fork(getWarehouseManageList, {
        ...tableParams,
        pageNum: 1,
      })
    } else { throw response.data }
  } catch(error) {
    console.log(error);
  }
}

      // getMaterialList: '/v3/goods/listByWarehouse', // 所有物品列表下拉项
      // insertWarehouse: '/v3/inventory/entry', // 备品备件/工器具/物资列表 => 入库||再入库
      // takeoutWarehouseMaterial: '/v3/inventory/out', // 出库 备品备件/工器具/物资列表
      // setStockMax: '/v3/inventory/thresholdSet', // 设置库存阈值
      // importStockFile: '/v3/inventory/importEntry', // 导入备品备件/工器具/物资列表
      // getMaterialDetailsList: '/v3/inventory/materialList', // 指定物资内所有物品列表(编码+物资名)
      // getStockDetail: '/v3/inventory/inventoryInfo', // 获取某库存详情
      // getStockList: '/v3/inventory/inventoryInfo', // 获取某库存信息列表
      // deleteStockInfo: '/v3/inventory/record/del', // 删除库存中某物资
      // recallStockInfo: '/v3/inventory/record/reCall', // 撤回库存中某物资的出库

export function* watchWarehouseManage() {
  yield takeLatest(warehouseManageAction.getWarehouses, getWarehouses);
  yield takeLatest(warehouseManageAction.getManufactures, getManufactures);
  yield takeLatest(warehouseManageAction.getModes, getModes);
  yield takeLatest(warehouseManageAction.getWarehouseManageList, getWarehouseManageList);
  yield takeLatest(warehouseManageAction.deleteWarehouseMaterial, deleteWarehouseMaterial);
  // yield takeLatest(warehouseAction.getGoodsList, getGoodsList);
  // yield takeLatest(warehouseAction.getGoodsAddList, getGoodsAddList);
  // yield takeLatest(warehouseAction.getGoodsDelList, getGoodsDelList);
  // yield takeLatest(warehouseAction.getGoodsUpdateList, getGoodsUpdateList);
}

