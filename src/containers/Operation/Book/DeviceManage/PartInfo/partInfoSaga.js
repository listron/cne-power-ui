import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../../constants/path';
import { partInfoAction } from './partInfoAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* getDeviceTypeList(action) {
  // 电站下设备类型
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceTypeList}/${
    payload.stationCode
    }`;
  // const url = `/mock/v3/ledger/devicetype/stationCode`;
  const { deviceCode, type, stationCode } = payload;
  try {
    const response = yield call(axios.get, url, { params: { ...payload } });

    if (response.data.code === '10000') {
      const collecto = response.data.data.collectorDevices || []; //获取当前集电线路请求的结果
      const boost = response.data.data.boostDevices || []; //获取当前升压站请求的结果
      const noType = response.data.data.undefinedDevices || []; //获取当前未分类请求的结果

      const curCollecto = collecto.map((e, i) => {
        //当前请求的数据处理，加一个children，
        return { ...e, children: [] };
      });
      const curBoost = boost.map((e, i) => {
        //当前请求的数据处理，加一个children，
        return { ...e, children: [] };
      });
      const curNoType = noType.map((e, i) => {
        //当前请求的数据处理，加一个children，
        return { ...e, children: [] };
      });

      const findFunc = (data = [], deviceCode, curCollecto) => {
        //查询匹配的deviceCode,并将新请求的值插入children
        // console.log("data: ", data);
        data.forEach((e, i) => {
          if (e.children && e.deviceCode !== deviceCode) {
            return findFunc(e.children, deviceCode, curCollecto);
          }
          e.children && e.children.push(...curCollecto);

          return data;
        });
        return data;
      };
      const getPreTreeData = yield select(state => ({
        //拿到上一次的值
        collectorDevices: state.operation.partInfo
          .get('collectorDevices')
          .toJS(),
        boostDevices: state.operation.partInfo.get('boostDevices').toJS(),
        undefinedDevices: state.operation.partInfo
          .get('undefinedDevices')
          .toJS(),
      }));
      // console.log("getPreTreeData: ", getPreTreeData);
      // console.log('payload: ', payload);

      let collectorDevices =
        type === '1'
          ? findFunc(getPreTreeData.collectorDevices, deviceCode, curCollecto)
          : getPreTreeData.collectorDevices;
      let boostDevices =
        type === '2'
          ? findFunc(getPreTreeData.boostDevices, deviceCode, curBoost)
          : getPreTreeData.boostDevices;
      let undefinedDevices =
        type === '3'
          ? findFunc(getPreTreeData.undefinedDevices, deviceCode, curNoType)
          : getPreTreeData.undefinedDevices;
      if (type === '0') {
        collectorDevices = curCollecto;
        boostDevices = curBoost;
        undefinedDevices = curNoType;
      }
      // console.log("collectorDevices", collectorDevices);

      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          // ...payload,
          loading: false,
          collectorDevices: collectorDevices || [],
          boostDevices: boostDevices || [],
          undefinedDevices: undefinedDevices || [],
        },
      });



    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { loading: false },
    });
  }
}
function* getDeviceComList(action) {
  // 设备下组件列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceComList}`;
  // const url = `/mock/v3/ledger/assetslist`;

  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          // ...payload,
          deviceComList: response.data.data || [],
        },
      });
    } else {
      message.error(`获取组件列表失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* addPartInfo(action) {
  // 添加组件
  const { payload } = action;
  const url = `${APIBasePath}${operation.addPartInfo}`;
  // const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment()
    .utc()
    .format();

  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {},
      });
      const payload = yield select(state => ({
        deviceCode: state.operation.partInfo.get('deviceCode'),
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
      }));
      yield put({
        type: partInfoAction.getDeviceComList,
        payload,
      });
    } else {
      message.error(`新增组件失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);

    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { loading: false },
    });
  }
}
function* editPartInfo(action) {
  // 编辑组件信息
  const { payload } = action;
  const url = `${APIBasePath}${operation.editPartInfo}`;
  // const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment()
    .utc()
    .format();
  try {
    const response = yield call(axios.put, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {},
      });
      const payload = yield select(state => ({
        deviceCode: state.operation.partInfo.get('deviceCode'),
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
      }));
      yield put({
        type: partInfoAction.getDeviceComList,
        payload,
      });
    } else {
      message.error(`编辑组件失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { loading: false },
    });
  }
}
function* getDetailPartInfo(action) {
  // 组件信息详情
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDetailPartInfo}/${payload.partsId}`;
  // const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          detailPartInfo: response.data.data || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* deletePartInfo(action) {
  // 删除组件信息
  const { payload } = action;
  const url = `${APIBasePath}${operation.deletePartInfo}/${payload.partsId}`;
  // const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
        deviceCode: state.operation.partInfo.get('deviceCode'),
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
      }));
      yield put({
        type: partInfoAction.getDeviceComList,
        payload,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* getPartsAssetTree(action) {
  // 生产资产树
  const { payload } = action;
  const url = `${APIBasePath}${operation.getAssetTree}`;
  // const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment()
    .utc()
    .format();
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          assetList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false, assetList: [] },
    });
  }
}
function* getDevicePartInfo(action) {
  //获取设备部件信息,复制功能中的树
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDevicePartInfo}/${
    payload.deviceFullcode
    }`;
  // const url = `/mock/v3/ledger/device/parts/list/deviceFullcode`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          partInfoTree: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* getPartsFactorsList(action) {
  //获取组件厂家列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceFactorsList}`;
  // const url = `/mock/v3/ledger/devicemanufactors/list`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          partsFactorsList: response.data.data.dataList || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* getfactorsPartsMode(action) {
  //获取某组件厂家下的设备型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.getfactorsDeviceMode}/${payload.manufactorId}`;
  // const url = `/mock/v3/ledger/devicemodes/manufactorId`;
  try {
    const response = yield call(axios.get, url, { params: { ...payload } });
    if (response.data.code === '10000') {
      const allMode = response.data.data || [];
      const modaArr = [];
      allMode.forEach((e, i) => {
        e.modeDatas &&
          e.modeDatas.forEach((item, index) => {
            modaArr.push(item);
          });
      });
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          factorsPartsMode: modaArr,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* addPartsFactors(action) {
  //新建组件厂家
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceFactors}`;
  const nowTime = moment()
    .utc()
    .format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          addmanufactorId: response.data.data.manufactorId || '',
        },
      });
      const payload = yield select(state => ({
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
        deviceTypeCode: state.operation.partInfo.get('deviceTypeCode'),
        assetsIds: state.operation.partInfo.get('assetsIds'),
      }));
      yield put({
        type: partInfoAction.getPartsFactorsList,
        payload,
      });
    } else {
      message.error(`新增组件厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* addPartsModes(action) {
  //新建组件型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceModes}`;
  const nowTime = moment()
    .utc()
    .format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          addmodeId: response.data.data.modeId || '',
        },
      });
      const payload = yield select(state => ({
        manufactorId: state.operation.partInfo.get('manufactorId'),
        assetsId: state.operation.partInfo.get('assetsId'),
      }));
      yield put({
        type: partInfoAction.getfactorsPartsMode,
        payload,
      });
    } else {
      message.error(`添加设备型号失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* copyPartInfo(action) {
  // 复制组件
  const { payload } = action;
  const url = `${APIBasePath}${operation.copyPartInfo}`;
  // const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment()
    .utc()
    .format();
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {},
      });
    } else {
      message.error(`新增组件失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);

    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { loading: false },
    });
  }
}
function* getPartAssetsTree(action) {
  //获取新增和编辑的生产资产树，通过设备全编码,deviceFullCode
  const { payload } = action;
  const url = `${APIBasePath}${operation.getPartAssetsTree}/${
    payload.deviceFullcode
    }`;
  // const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          partAssetsTree: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    });
  }
}

export function* watchBookPartsInfo() {
  yield takeLatest(partInfoAction.getDeviceTypeList, getDeviceTypeList);
  yield takeLatest(partInfoAction.getDeviceComList, getDeviceComList);
  yield takeLatest(partInfoAction.addPartInfo, addPartInfo);
  yield takeLatest(partInfoAction.editPartInfo, editPartInfo);
  yield takeLatest(partInfoAction.getDetailPartInfo, getDetailPartInfo);
  yield takeLatest(partInfoAction.deletePartInfo, deletePartInfo);
  yield takeLatest(partInfoAction.getPartsAssetTree, getPartsAssetTree);
  yield takeLatest(partInfoAction.getPartsFactorsList, getPartsFactorsList);
  yield takeLatest(partInfoAction.getfactorsPartsMode, getfactorsPartsMode);
  yield takeLatest(partInfoAction.addPartsFactors, addPartsFactors);
  yield takeLatest(partInfoAction.addPartsModes, addPartsModes);
  yield takeLatest(partInfoAction.getDevicePartInfo, getDevicePartInfo);
  yield takeLatest(partInfoAction.copyPartInfo, copyPartInfo);
  yield takeLatest(partInfoAction.getPartAssetsTree, getPartAssetsTree);
}
