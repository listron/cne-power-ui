import {put, call, takeLatest, select} from 'redux-saga/effects';
import {meterDetailAction} from './meterDetailReducer';
import axios from 'axios';
import path from '@path';

import {message} from 'antd';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {ticket} = APISubPaths;

function* getProcessBaseInfo(action) { // 获取基本信息数据
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getProcessBaseInfo}/${payload.meterId}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        baseLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          baseLoading: false,
          meterBaseData: response.data.data,
        },
      });
      // 获取电站下的权限用户
      if (response.data.data.stationCode) {
        yield put({
          type: meterDetailAction.getBaseUsername,
          payload: {
            stationCode: response.data.data.stationCode,
          },
        });
      }
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        baseLoading: false,
      },
    });
    console.log(e);
  }
}

function* getOperableUser(action) { // 获取流程可操作人数据
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getOperableUser}/${payload.meterId}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        operableUserLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          operableUserLoading: false,
          operableUserData: response.data.data,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        operableUserLoading: false,
      },
    });
    console.log(e);
  }
}

function* getProcessList(action) { // 获取流程流转信息数据
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getProcessList}/${payload.meterId}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        processListLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          processListLoading: false,
          processList: response.data.data,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        processListLoading: false,
      },
    });
    console.log(e);
  }
}

// 一维数组转化为二维数组
function sliceArr(arr, n) {

  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const newArr = [], size = arr.length;
  let count = Math.floor((size - 1) / n) + 1;

  while (count--) {
    newArr.unshift(arr.slice(count * n, (count + 1) * n));
  }

  return newArr;
}

function* getBaseUsername(action) { // 获取有权限电站权限用户
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getBaseUsername}/${payload.stationCode}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        usernameLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const {operableUserData} = yield select(state => state.operation.meterDetail.toJS());
      const operableUserArr = operableUserData[0].ableUserIds && operableUserData[0].ableUserIds.split(',') || [];
      const arr = [];
      response.data.data && response.data.data.forEach(cur => {
        if (!operableUserArr.includes(`${cur.userId}`)) {
          arr.push(cur);
        }
      });
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          usernameLoading: false,
          usernameList: sliceArr(arr, 2),
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        usernameLoading: false,
      },
    });
    console.log(e);
  }
}

function* getReadMeter(action) { // 获取处理信息数据
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getReadMeter}/${payload.meterId}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        readMeterLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      /**
       *
       * response.data.data
       * 止码和起码不是数组的形式，要想每个input都能自己编辑自己
       * 多加了几个字段，判断哪个表格可以编辑和错误提示
       * flag1,flag2,flag3,flag4,flag5 是否编辑
       * type1,type2,type3,type4,type5 判断状态0，1，2文字和背景颜色不同
       * errorFlag1,errorFlag2,errorFlag3,errorFlag4,errorFlag5 判断非编辑状态 背景色
       * imgFlag 判断图片可否编辑
       * loading 判断图片是否上传
       * percent 判断图片上传进度
       * */
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          readMeterLoading: false,
          readMeterData: { // 可以修改的数据
            ...response.data.data,
            onlineDatas: response.data.data.onlineDatas.map(cur => {
              return Object.assign(cur, {
                flag1: false,
                flag2: false,
                flag3: false,
                flag4: false,
                flag5: false,
                type1: 0,
                type2: 0,
                type3: 0,
                type4: 0,
                type5: 0,
                errorFlag1: false,
                errorFlag2: false,
                errorFlag3: false,
                errorFlag4: false,
                errorFlag5: false,
                imgFlag: false,
                loading: false,
                percent: 0,
              });
            }),
            generationDatas: response.data.data.generationDatas.map(cur => {
              return Object.assign(cur, {
                flag1: false,
                flag2: false,
                flag3: false,
                flag4: false,
                flag5: false,
                type1: 0,
                type2: 0,
                type3: 0,
                type4: 0,
                type5: 0,
                errorFlag1: false,
                errorFlag2: false,
                errorFlag3: false,
                errorFlag4: false,
                errorFlag5: false,
                imgFlag: false,
                loading: false,
                percent: 0,
              });
            }),
          },
          otherReadMeterData: response.data.data, // 备份-作为参考的数据
          newReadMeterData: {// 备份-作为参考的数据
            ...response.data.data,
            onlineDatas: response.data.data.onlineDatas.map(cur => {
              const obj = {};
              obj.magnification = cur.magnification;
              obj.flatStartCode = cur.flatStartCode;
              obj.meterNumber = cur.meterNumber;
              obj.meterName = cur.meterName;
              obj.totalEndCode = -1;
              obj.lowStartCode = cur.lowStartCode;
              obj.topEndCode = -1;
              obj.detailId = cur.detailId;
              obj.lowEndCode = -1;
              obj.peakEndCode = -1;
              obj.topStartCode = cur.topStartCode;
              obj.peakStartCode = cur.peakStartCode;
              obj.meterImgs = cur.meterImgs.map(item => {
                return {
                  url: item.url,
                  updateSign: 0,
                  imgId: item.imgId,
                };
              });
              obj.totalStartCode = cur.totalStartCode;
              obj.flatEndCode = -1;
              obj.meterId = cur.meterId;
              return obj;
            }),
            generationDatas: response.data.data.generationDatas.map(cur => {
              const obj = {};
              obj.magnification = cur.magnification;
              obj.flatStartCode = cur.flatStartCode;
              obj.meterNumber = cur.meterNumber;
              obj.meterName = cur.meterName;
              obj.totalEndCode = -1;
              obj.lowStartCode = cur.lowStartCode;
              obj.topEndCode = -1;
              obj.detailId = cur.detailId;
              obj.lowEndCode = -1;
              obj.peakEndCode = -1;
              obj.topStartCode = cur.topStartCode;
              obj.peakStartCode = cur.peakStartCode;
              obj.meterImgs = cur.meterImgs.map(item => {
                return {
                  url: item.url,
                  updateSign: 0,
                  imgId: item.imgId,
                };
              });
              obj.totalStartCode = cur.totalStartCode;
              obj.flatEndCode = -1;
              obj.meterId = cur.meterId;
              return obj;
            }),
          },
        },
      });
      // yield put({
      //   type: meterDetailAction.changeStore,
      //   payload: {
      //     readMeterLoading: false,
      //     readMeterData: {
      //       ...response.data.data,
      //       onlineDatas: response.data.data.onlineDatas.map(cur => {
      //         return Object.assign(cur, {
      //           flag1: false,
      //           flag2: false,
      //           flag3: false,
      //           flag4: false,
      //           flag5: false,
      //           type1: 0,
      //           type2: 0,
      //           type3: 0,
      //           type4: 0,
      //           type5: 0,
      //           errorFlag1: false,
      //           errorFlag2: false,
      //           errorFlag3: false,
      //           errorFlag4: false,
      //           errorFlag5: false,
      //           imgFlag: false,
      //           loading: false,
      //           percent: 0,
      //         });
      //       }),
      //       generationDatas: response.data.data.generationDatas.map(cur => {
      //         return Object.assign(cur, {
      //           flag1: false,
      //           flag2: false,
      //           flag3: false,
      //           flag4: false,
      //           flag5: false,
      //           type1: 0,
      //           type2: 0,
      //           type3: 0,
      //           type4: 0,
      //           type5: 0,
      //           errorFlag1: false,
      //           errorFlag2: false,
      //           errorFlag3: false,
      //           errorFlag4: false,
      //           errorFlag5: false,
      //           imgFlag: false,
      //           loading: false,
      //           percent: 0,
      //         });
      //       }),
      //     },
      //   },
      // });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        readMeterLoading: false,
      },
    });
    console.log(e);
  }
}

function* getAddUser(action) { // 添加处理人（执行人）
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getAddUser}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        addUserLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 重新调用基本信息
      yield put({
        type: meterDetailAction.getProcessBaseInfo,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 可执行人数据
      yield put({
        type: meterDetailAction.getOperableUser,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 重新调用流程信息
      yield put({
        type: meterDetailAction.getProcessList,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 清空选中
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          addUserLoading: false,
          checkedUserList: [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        addUserLoading: false,
      },
    });
    console.log(e);
  }
}


function* getProcessAction(action) { // 获取流程可执行动作
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getProcessAction}/${payload.meterId}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        actionLoading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: meterDetailAction.changeStore,
        payload: {
          actionLoading: false,
          processActionData: response.data.data,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        actionLoading: false,
      },
    });
    console.log(e);
  }
}

function* getSubmitAction(action) { // 提交验收按钮
  const {payload} = action;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  const url = `${APIBasePath}${ticket.getSubmitAction}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        submitLoading: true,
      },
    });
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func();
      // 获取流程可操作人数据
      yield put({
        type: meterDetailAction.getOperableUser,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程信息
      yield put({
        type: meterDetailAction.getProcessList,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程可执行动作
      yield put({
        type: meterDetailAction.getReadMeter,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取抄表基本信息
      yield put({
        type: meterDetailAction.getProcessAction,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取抄表基本信息
      yield put({
        type: meterDetailAction.getProcessBaseInfo,
        payload: {
          meterId: payload.docketId,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        submitLoading: false,
      },
    });
    console.log(e);
  }
}

function* getReceiveAction(action) { // 提交验收按钮
  const {payload} = action;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  const url = `${APIBasePath}${ticket.getReceiveAction}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        receiveLoading: true,
      },
    });
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func();
      // 获取流程可操作人数据
      yield put({
        type: meterDetailAction.getOperableUser,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程信息
      yield put({
        type: meterDetailAction.getProcessList,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程可执行动作
      yield put({
        type: meterDetailAction.getReadMeter,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取抄表基本信息
      yield put({
        type: meterDetailAction.getProcessAction,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取抄表基本信息
      yield put({
        type: meterDetailAction.getProcessBaseInfo,
        payload: {
          meterId: payload.docketId,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        receiveLoading: false,
      },
    });
    console.log(e);
  }
}

function* getSaveAction(action) { // 保存按钮
  const {payload} = action;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  const url = `${APIBasePath}${ticket.getSaveAction}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        saveLoading: true,
      },
    });
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func();
      // 获取抄表基本信息
      yield put({
        type: meterDetailAction.getProcessBaseInfo,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程信息
      yield put({
        type: meterDetailAction.getProcessList,
        payload: {
          meterId: payload.docketId,
        },
      });
      // 获取流程可执行动作
      yield put({
        type: meterDetailAction.getReadMeter,
        payload: {
          meterId: payload.docketId,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        saveLoading: false,
      },
    });
    console.log(e);
  }
}


function* getRotateImg(action) { // 旋转图片
  const {payload} = action;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  const url = `${APIBasePath}${ticket.getRotateImg}`;
  try {
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        rotateLoading: true,
      },
    });
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func(response.data.data);
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: meterDetailAction.changeStore,
      payload: {
        rotateLoading: false,
      },
    });
    console.log(e);
  }
}

export function* watchMeterDetail() {
  yield takeLatest(meterDetailAction.getProcessBaseInfo, getProcessBaseInfo);
  yield takeLatest(meterDetailAction.getOperableUser, getOperableUser);
  yield takeLatest(meterDetailAction.getProcessList, getProcessList);
  yield takeLatest(meterDetailAction.getBaseUsername, getBaseUsername);
  yield takeLatest(meterDetailAction.getReadMeter, getReadMeter);
  yield takeLatest(meterDetailAction.getAddUser, getAddUser);
  yield takeLatest(meterDetailAction.getProcessAction, getProcessAction);
  yield takeLatest(meterDetailAction.getSubmitAction, getSubmitAction);
  yield takeLatest(meterDetailAction.getReceiveAction, getReceiveAction);
  yield takeLatest(meterDetailAction.getSaveAction, getSaveAction);
  yield takeLatest(meterDetailAction.getRotateImg, getRotateImg);
}

