import { put, takeLatest, select, call, fork } from 'redux-saga/effects';
import { warehouseManageAction } from './warehouseManageReducer';
import path from '../../../../constants/path';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

const stockTypeCodes = { // 配置数据.
  spares: 101,
  tools: 200,
  materials: 300,
};

function* getWarehouses() { // 所有仓库列表
  const url = `${APIBasePath}${operation.getWarehouses}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { warehouseList: response.data.data || [] },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { warehouseList: [] },
    });
  }
}

function* getManufactures() { // 所有厂家列表
  const url = `${APIBasePath}${operation.getManufactures}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { manufacturerList: response.data.data || [] },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { manufacturerList: [] },
    });
  }
}

function* getModes({ payload = {} }) { // 厂家下所有型号
  const { selectedManufacturer, formModes } = payload;
  const url = `${APIBasePath}${operation.getModes}/${selectedManufacturer}/modes`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          [formModes ? 'insertModes' : 'modeList']: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { [formModes ? 'insertModes' : 'modeList']: [] },
    });
  }
}

function *getWarehouseManageList({ payload = {} }) { // 获取各类管理库存信息
  const url = `${APIBasePath}${operation.getWarehouseManageList}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { stocksListLoading: true },
    });
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
          stocksListLoading: false,
          stocksList: response.data.data.dataList || [],
          totalCount: response.data.data.pageCount || 0,
        },
      });
    } else { throw response.data; }
  } catch (error) {
    console.log(error);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: {
        stocksList: [],
        totalCount: 0,
        stocksListLoading: false,
      },
    });
  }
}

function *deleteWarehouseMaterial({ payload }) { // 删除选中项库存
  const url = `${APIBasePath}${operation.deleteWarehouseMaterial}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { delStockLoading: true },
    });
    const { tabName, tableParams } = yield select(state => state.operation.warehouseManage.toJS());
    const { checkedStocks = [] } = payload;
    const response = yield call(axios.post, url, {
      goodsMaxType: stockTypeCodes[tabName],
      inventoryIds: checkedStocks.map(e => e.inventoryId).join(','),
    });
    if (response.data.code === '10000') { // 删除成功后重新请求列表数据
      yield put({
        type: warehouseManageAction.changeStore,
        payload: { delStockLoading: false, checkedStocks: [] },
      });
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        },
      });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { delStockLoading: false },
    });
    message.error(`删除失败,${error.message}`);
    console.log(error);
  }
}

function *setStockMax({ payload }) { // 设置备品备件阈值
  const url = `${APIBasePath}${operation.setStockMax}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { maxSettingLoading: true },
    });
    const response = yield call(axios.put, url, { ...payload });
    const { tableParams } = yield select(state => state.operation.warehouseManage.toJS());
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { maxSettingLoading: false },
    });
    if (response.data.code === '10000') {
      yield fork(getWarehouseManageList, {
        payload: { ...tableParams },
      });
      yield put({
        type: warehouseManageAction.changeStore,
        payload: { stockMaxShow: false },
      });
    } else { throw response.data; }
  } catch (error) {
    message.error(`阈值设置失败, ${error.message}`);
    console.log(error);
  }
}

function *importStockFile({ payload }) {// 导入备品备件/工器具/物资列表excel
  const url = `${APIBasePath}${operation.importStockFile}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { importLoading: true },
    });
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
      yield put({
        type: warehouseManageAction.changeStore,
        payload: { importLoading: false, importFileShow: false },
      });
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        },
      });
    } else { throw response.data; }
  } catch (error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { importLoading: false },
    });
    message.error(`导入失败, ${error.message}`);
  }
}

function *getGoodsList({ payload }) { // 指定物资类型下所有物品列表
  // const url = `${APIBasePath}${operation.getGoodsList}`;
  const url = `${APIBasePath}${operation.getGoodsList}/${payload.goodsMaxType}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          goodsList: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (error) {
    console.log(error);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { goodsList: [] },
    });
  }
}

function *addNewGood({ payload }) { // 新增物品
  const url = `${APIBasePath}${operation.goodsAdd}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addGoodStatus: 'loading' },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') { // 重新请求仓库下物品
      const { tabName } = yield select(state => state.operation.warehouseManage.toJS());
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          addGoodName: payload.goodsName,
          addGoodStatus: 'success',
        },
      });
      yield fork(getGoodsList, { payload: { goodsMaxType: stockTypeCodes[tabName] } });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addGoodStatus: 'normal' },
    });
    message.error(`物品添加失败,请重试,${error.message}`);
  }
}

function *addNewManu({ payload }) { // 新增厂家
  const url = `${APIBasePath}${operation.addDeviceFactors}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addManuStatus: 'loading' },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      nowTime: moment().utc().format(),
    });
    if (response.data.code === '10000') { // 添加成功, 重新请求内外部厂家列表
      yield call(getAssetsManufacture, { payload });
      yield put({ // 厂家列表更新后,关闭弹框
        type: warehouseManageAction.fetchSuccess,
        payload: {
          addManufactorId: response.data.data.manufactorId,
          addManuStatus: 'success',
        },
      });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addManuStatus: 'normal' },
    });
    message.error(`新增厂家失败,${error.message}`);
  }
}

function *addNewType({ payload }) { // 新增型号
  const url = `${APIBasePath}${operation.addDeviceModes}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addTypeStatus: 'loading' },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      nowTime: moment().utc().format(),
    });
    if (response.data.code === '10000') { // 重新请求厂家下型号
      yield call(getModes, { payload: {
        selectedManufacturer: payload.manufactorId,
        formModes: true,
      }});
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          adddModeName: payload.deviceModeName,
          addTypeStatus: 'success',
        },
      });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { addTypeStatus: 'normal' },
    });
    message.error(`新增型号失败,${error.message}`);
  }
}

function *getWarehouseStationType({ payload }) { // 获取生产资产树 => 先获取仓库所属电站类型
  const url = `${APIBasePath}${operation.getWarehouseStationType}/${payload.warehouseId}`;
  try {
    const response = yield call(axios.get, url);
    const responseData = response.data;
    const typeInfo = responseData.data;
    if (responseData.code === '10000' && typeInfo.length === 1 && typeInfo.some(e => e === 0 || e === 1)) {
      yield fork(getAssetList, { stationType: typeInfo[0] });
    } else { throw responseData; }
  } catch(error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { assetsTree: [] },
    });
    message.error('所选仓库不符合入库要求, 无法获取到生产资产');
  }
}

function *getAssetList({ stationType }){
  const url = `${APIBasePath}${operation.getAssetTree}`;
  try {
    const response = yield call(axios.post, url, {
      stationType,
      assetsParentId: 0,
      nowTime: moment().utc().format(),
    });
    if (response.data.code === '10000'){
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { assetsTree: response.data.data || [] },
      });
    } else { throw response.data; }
  } catch (error) {
    message.error(`获取生产资产失败, ${error.message}`);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { assetsTree: [] },
    });
  }
}

function *getAssetsManufacture({ payload }){ // 选定生产资产下的厂家列表
  const url = `${APIBasePath}${operation.getDeviceFactorsList}`;
  try {
    const { assetsIds } = payload;
    const response = yield call(axios.post, url, {
      assetsId: assetsIds[assetsIds.length - 1],
      orderField: '1',
      orderMethod: 'desc',
    });
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { assetsManufac: response.data.data.dataList || [] },
      });
    } else { throw response.data; }
  } catch (error) {
    message.error('获取厂家列表失败，请重试');
  }

}

function *insertWarehouse({ payload }) {// 备品备件/工器具/物资列表 => 入库||再入库
  const url = `${APIBasePath}${operation.insertWarehouse}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { insertStatus: 'loading' },
    });
    const { tableParams, tabName } = yield select(state => state.operation.warehouseManage.toJS());
    const response = yield call(axios.post, url, {
      goodsMaxType: stockTypeCodes[tabName],
      ...payload,
    });
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.changeStore,
        payload: { insertStatus: 'success' },
      });
      yield fork(getWarehouseManageList, { payload: { ...tableParams } });
    } else { throw response.data; }
  } catch (err) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { insertStatus: 'normal' },
    });
    message.error(`入库失败,请重试,${err.message}`);
  }
}

function *getMaterialDetailsList({ payload }) { // 获取仓库下的物资列表
  const url = `${APIBasePath}${operation.getMaterialDetailsList}`;
  try{
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { materialListLoading: true },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          materialListLoading: false,
          materialDetailsList: response.data.data.dataList || [],
          materialListTotal: response.data.data.pageCount || 0,
        },
      });
    } else { throw response.data; }
  } catch (error) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: {
        materialListLoading: false,
        materialDetailsList: [],
        materialListTotal: 0,
      },
    });
  }
}

function *takeoutWarehouseMaterial({ payload }){ // 出库
  const url = `${APIBasePath}${operation.takeoutWarehouseMaterial}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { takeoutStatus: 'loading' },
    });
    const { tableParams, tabName } = yield select(state => state.operation.warehouseManage.toJS());
    const response = yield call(axios.post, url, {
      ...payload,
      goodsMaxType: stockTypeCodes[tabName],
    });
    if (response.data.code === '10000') { // 成功出库，重新请求列表
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { takeoutStatus: 'success' },
      });
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        },
      });
    } else { throw response.data; }
  } catch (err) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { takeoutStatus: 'normal' },
    });
    message.error(`出库失败,请重试,${err.message}`);
  }
}

function *getReserveDetail({ payload }) { // 获取某库存详情
  const url = `${APIBasePath}${operation.getReserveDetail}`;
  try {
    const response = yield call(axios.get, url, {params: payload});
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: {
          reserveDetail: response.data.data || {},
        },
      });
    } else { throw response.data; }
  } catch (err) {
    console.log(err);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { reserveDetail: {} },
    });
  }
}

function *getReserveList({ payload }) { // 获取某库存信息列表
  const url = `${APIBasePath}${operation.getReserveList}`;
  try {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { reserveListLoading: true },
    });
    const response = yield call(axios.post, url, payload);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { reserveListLoading: false },
    });
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { reserveListInfo: response.data.data || {} },
      });
    } else { throw response.data; }
  } catch (err) {
    console.log(err);
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { reserveListInfo: {} },
    });
  }
}

function *deleteReserveInfo({ payload }){ // 删除库存中某物资
  const url = `${APIBasePath}${operation.deleteReserveInfo}`;
  try {
    const response = yield call(axios.delete, url, { params: payload });
    if (response.data.code === '10000') { // 删除成功, 重新请求物资列表.
      const { reserveInventoryId, tableParams } = yield select(state => state.operation.warehouseManage.toJS());
      yield fork(getReserveList, {
        payload: {
          inventoryId: reserveInventoryId,
        },
      });
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        },
      });
    } else { throw response.data; }
  } catch (err) {
    message.err(`删除失败, ${err.message}`);
  }
}

function *recallReserveInfo({ payload }){ // 撤回库存中某物资的出库
  const url = `${APIBasePath}${operation.recallReserveInfo}/${payload.materialCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') { // 撤回后重新请求物资列表 + 主页列表.
      const { reserveInventoryId, tableParams } = yield select(state => state.operation.warehouseManage.toJS());
      yield fork(getReserveList, {
        payload: {
          inventoryId: reserveInventoryId,
        },
      });
      yield fork(getWarehouseManageList, {
        payload: {
          ...tableParams,
          pageNum: 1,
        },
      });
    } else { throw response.data; }
  } catch (err) {
    message.err(`撤回失败, ${err.message}`);
  }
}

function* getMainDeviceEditCodes() { // 获得可编辑主设备的的企业code
  const url = `${APIBasePath}${operation.getEnterprisecodes}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseManageAction.fetchSuccess,
        payload: { mainDeviceEditCodes: response.data.data || [] },
      });
    } else { throw response.data; }
  } catch (err) {
    yield put({
      type: warehouseManageAction.changeStore,
      payload: { mainDeviceEditCodes: [] },
    });
  }
}

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
  yield takeLatest(warehouseManageAction.addNewManu, addNewManu);
  yield takeLatest(warehouseManageAction.addNewType, addNewType);
  yield takeLatest(warehouseManageAction.getWarehouseStationType, getWarehouseStationType);
  yield takeLatest(warehouseManageAction.getAssetsManufacture, getAssetsManufacture);
  yield takeLatest(warehouseManageAction.insertWarehouse, insertWarehouse);
  yield takeLatest(warehouseManageAction.getMaterialDetailsList, getMaterialDetailsList);
  yield takeLatest(warehouseManageAction.takeoutWarehouseMaterial, takeoutWarehouseMaterial);
  yield takeLatest(warehouseManageAction.getReserveDetail, getReserveDetail);
  yield takeLatest(warehouseManageAction.getReserveList, getReserveList);
  yield takeLatest(warehouseManageAction.deleteReserveInfo, deleteReserveInfo);
  yield takeLatest(warehouseManageAction.recallReserveInfo, recallReserveInfo);
  yield takeLatest(warehouseManageAction.getMainDeviceEditCodes, getMainDeviceEditCodes);
}
