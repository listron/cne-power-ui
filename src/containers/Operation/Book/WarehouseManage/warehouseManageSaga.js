import { put, takeLatest, select, call, fork } from 'redux-saga/effects';
import { warehouseManageAction } from './warehouseManageReducer';
import path from '../../../../constants/path';
import { message } from 'antd';
import axios from 'axios';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

const stockTypeCodes = {
  spares: 101,
  tools: 200,
  materials: 300
}

function* getWarehouses() { // 所有仓库列表
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

function* getManufactures() { // 所有厂家列表
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

function* getModes({ payload = {} }) { // 厂家下所有型号
  const { selectedManufacturer, formModes } = payload;
  const url = `${APIBasePath}${operation.getModes}/${selectedManufacturer}/modes`;
  try {
    const response =  yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          [formModes ? 'insertModes' : 'modeList']: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { [formModes ? 'insertModes' : 'modeList']: [] }
    })
  }
}

function *getWarehouseManageList({ payload = {} }) { // 获取各类管理库存信息
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

function *deleteWarehouseMaterial({ payload }) { // 删除选中项库存
  const url = `${APIBasePath}${operation.deleteWarehouseMaterial}`;
  try {
    const { tabName, tableParams } = yield select(state => state.operation.warehouseManage.toJS());
    const { checkedStocks = [] } = payload;
    const response = yield call(axios.post, url, {
      goodsMaxType: stockTypeCodes[tabName],
      inventoryIds: checkedStocks.map(e => e.inventoryId).join(','),
    })
    if (response.data.code === '10000') { // 删除成功后重新请求列表数据
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        }
      })
    } else { throw response.data }
  } catch(error) {
    console.log(error);
  }
}

function *setStockMax({ payload }) { // 设置备品备件阈值
  const url = `${APIBasePath}${operation.setStockMax}`;
  try {
    const response = yield call(axios.put, url, { ...payload });
    const { tableParams } = yield select(state => state.operation.warehouseManage.toJS());
    if (response.data.code === '10000') {
      yield fork(getWarehouseManageList, { 
        payload: { ...tableParams }
      });
      yield put({
        type: warehouseManageAction.changeStore,
        payload: { stockMaxShow: false },
      })
    } else { throw response.data }
  } catch (error) {
    console.log(error);
  }
}

function *importStockFile({ payload }) {// 导入备品备件/工器具/物资列表excel
  const url = `${APIBasePath}${operation.setStockMax}`;
  try {
    const { tableParams, tabName } = yield select(state => state.operation.warehouseManage.toJS());
    const formData = new FormData();
    const { warehouseId, resetStock, fileList } = payload;
    formData.append('file', fileList[0]);
    formData.append('warehouseId', warehouseId);
    formData.append('isInitialize', resetStock ? 1 : 0);
    formData.append('goodsMaxType', stockTypeCodes[tabName]);
    const response = yield call(axios, {
      method: 'post',
      url,
      data: formData,
      processData: false,
      contentType: false,
    });
    if (response.data.code === '10000') { // 导入成功刷新列表
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        }
      })
    } else { throw response.data }
  } catch (error) {
    console.log(error);
  }
}

function *getGoodsList({ payload }) { // 仓库下所有物品列表
  const url = `${APIBasePath}${operation.getGoodsList}`;
  try {
    const response = yield call(axios.get, url, {
      params: { ...payload }
    });
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          goodsList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (error) {
    console.log(error);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { goodsList: [] },
    })
  }
}

function *addNewGood({ payload }) { // 新增物品
  const url = `${APIBasePath}${operation.goodsAdd}`
  try {
    const { warehouseId, ...resParams } = payload;
    const response = yield call(axios.post, url, { ...resParams });
    if (response.data.code === '10000') { // 重新请求仓库下物品
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { addGoodName: payload.goodsName },
      })
      yield fork(getGoodsList, { payload: { warehouseId } });
    } else { throw response.data }
  } catch(error) {
    message.error('新增失败,请重试');
    console.log(error);
  }
}
      // insertWarehouse: '/v3/inventory/entry', // 备品备件/工器具/物资列表 => 入库||再入库
      // takeoutWarehouseMaterial: '/v3/inventory/out', // 出库 备品备件/工器具/物资列表
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
  yield takeLatest(warehouseManageAction.setStockMax, setStockMax);
  yield takeLatest(warehouseManageAction.importStockFile, importStockFile);
  yield takeLatest(warehouseManageAction.getGoodsList, getGoodsList);
  yield takeLatest(warehouseManageAction.addNewGood, addNewGood);
}

