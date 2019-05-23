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
      warehouseDel,
      warehouseUpdate,
      goodsList,
      goodsAdd,
      goodsDel,
      goodsUpdate
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
        warehouseListLoading: true,
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
          warehouseListLoading: false,
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
        loading: false,
        warehouseListLoading: false,
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
        warehouseAddLoading: true,
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
      yield put({
        type: warehouseAction.warehouseFetchSuccess,
        payload: {
          warehouseAddLoading: false,
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
        loading: false,
        warehouseAddLoading: false,
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

function* getWarehouseUpdateList(action) { // 仓库更新
  const {
    payload: {
      warehouseId,
      warehouseName,
      stationCodes,
      pageNum,
      pageSize,
      searchName,
      func
    }
  } = action;
  // 更新需要的参数
  const paramsUpdate = {
    warehouseId,
    warehouseName,
    stationCodes,
  };
  const url = `${APIBasePath}${warehouseUpdate}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
      }
    });
    const response = yield call(axios.put, url, paramsUpdate);
    if (response.data.code === '10000') {
      // 更新完之后在调用仓库列表
      const paramsList = {
        warehouseName: searchName,
        pageNum,
        pageSize
      };
      // 更新成功退出编辑状态
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

function* getGoodsList(action) { // 物品（物资）清单分页列表
  const { payload } = action;
  const url = `${APIBasePath}${goodsList}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
        goodsListLoading: true,
        pageSize: payload.pageSize || 10,
        pageNum: payload.pageNum || 1,
        goodsName: payload.goodsName,
        goodsType: payload.goodsType,
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warehouseAction.warehouseFetchSuccess,
        payload: {
          goodsData: response.data.data || {},
          loading: false,
          goodsListLoading: false,
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
        loading: false,
        goodsListLoading: false,
      }
    });
  }
}

function* getGoodsAddList(action) { // 物品添加
  const {
    payload: {
      goodsUnit,
      goodsName,
      goodsType,
      pageNum,
      pageSize,
      searchName,
      func
    }
  } = action;
  // 添加的参数
  const paramsAdd = {
    goodsUnit,
    goodsName,
    goodsType
  };
  const url = `${APIBasePath}${goodsAdd}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
        goodsAddLoading: true,
      }
    });
    const response = yield call(axios.post, url, paramsAdd);
    if (response.data.code === '10000') {
      // 添加完之后在调用物品列表
      const paramsList = {
        searchName,
        goodsType,
        pageNum,
        pageSize
      };
      // 添加成功清空input的值
      func();
      yield put({
        type: warehouseAction.getGoodsList,
        payload: paramsList,
      });
      yield put({
        type: warehouseAction.warehouseFetchSuccess,
        payload: {
          goodsAddLoading: false,
        }
      });
    }else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: false,
        goodsAddLoading: false,
      }
    });
  }
}

function* getGoodsDelList(action) { // 物品删除
  const {
    payload: {
      goodsId,
      pageNum,
      pageSize,
      goodsName,
      goodsType,
      func
    }
  } = action;
  const url = `${APIBasePath}${goodsDel}?goodsIds=${goodsId}`;
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
      }
    });
    const response = yield call(axios.delete, url);
    if (response.data.code === '10000') {
      // 删除完之后在调用物品列表
      const paramsList = {
        pageNum,
        pageSize,
        goodsName,
        goodsType
      };
      // 添加成功清空input的值
      func();
      yield put({
        type: warehouseAction.getGoodsList,
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

function* getGoodsUpdateList(action) { // 物品（物资）修改
  const {
    payload: {
      goodsId,
      goodsName,
      goodsUnit,
      pageNum,
      pageSize,
      searchName,
      goodsType,
      func
    }
  } = action;
  const url = `${APIBasePath}${goodsUpdate}`;
  // 修改参数
  const paramsUpdate = {
    goodsId,
    goodsName,
    goodsUnit
  };
  try {
    yield put({
      type: warehouseAction.warehouseFetchSuccess,
      payload: {
        loading: true,
      }
    });
    const response = yield call(axios.put, url, paramsUpdate);
    if (response.data.code === '10000') {
      // 更新完之后在调用物品列表
      const paramsList = {
        pageNum,
        pageSize,
        searchName,
        goodsType
      };
      // 更新成功退出编辑状态
      func();
      yield put({
        type: warehouseAction.getGoodsList,
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
  yield takeEvery(warehouseAction.getWarehouseUpdateList, getWarehouseUpdateList);
  yield takeEvery(warehouseAction.getGoodsList, getGoodsList);
  yield takeEvery(warehouseAction.getGoodsAddList, getGoodsAddList);
  yield takeEvery(warehouseAction.getGoodsDelList, getGoodsDelList);
  yield takeEvery(warehouseAction.getGoodsUpdateList, getGoodsUpdateList);

}

