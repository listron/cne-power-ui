import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { inspectDetailAction } from './inspectDetailReducer';
import axios from 'axios';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

function* getInspectDetail(action) { // 获取工单详情数据
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getNewInspectDetail}/${payload.inspectId}`;
  try {
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    // if (response.data.code === '10000') {

    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: false,
        // inspectDetail: response.data.data || {},
        inspectDetail: {
          inspectId: '448853351629312',
          inspectName: '巡检名称xxxx',
          inspectStatus: '3',
          deviceTypeCodes: '201，202，203',
          deviceTypeNames: '设备类型1,设备类型2,设备类型3,设备类型4,设备类型5,设备类型6,',
          isOverTime: 1,
          stationCode: '360',
          stationName: '洱源',
          stationType: '1',
          startTime: '2019-10-11',
          createTime: '2019-11-11',
          deadLine: '2019-11-12',
          flowStatus: 1,
          item: {},
          flows: [],

        },
        // inspectDeviceInfo: response.data.data.item || {},
        inspectDeviceInfo: {
          matrixes: [
            {
              belongMatrix: '方阵1',
              status: 0,
              deviceTypes: [
                {
                  deviceTypeCode: 202,
                  deviceTypeName: '组串逆变器',
                  unknownNum: 2,
                  normalNum: 4,
                  abnormalNum: 5,
                  devices: [
                    {
                      deviceCode: '设备code',
                      deviceName: '设备name',
                      status: 0,
                      defectIds: ['缺陷1', '缺陷2'],
                    },
                    {
                      deviceCode: '设备code2',
                      deviceName: '设备name2',
                      status: 1,
                      defectIds: ['缺陷3', '缺陷4'],
                    },
                  ],
                },
              ],
            },
            {
              belongMatrix: '方阵2',
              status: 1,
              deviceTypes: [
                {
                  deviceTypeCode: 209,
                  deviceTypeName: '气象站',
                  unknownNum: 2,
                  normalNum: 4,
                  abnormalNum: 5,
                  devices: [
                    {
                      deviceCode: '设备code',
                      deviceName: '设备name',
                      status: 0,
                      defectIds: ['缺陷1', '缺陷2'],
                    },
                    {
                      deviceCode: '设备code2',
                      deviceName: '设备name2',
                      status: 1,
                      defectIds: ['缺陷3', '缺陷4'],
                    },
                  ],
                },
              ],
            },
          ],
          deviceTypes: [
            {
              deviceTypeCode: 201,
              deviceTypeName: '逆变器',
              unknownNum: 0,
              normalNum: 4,
              abnormalNum: 5,
              devices: [
                {
                  deviceCode: '设备code',
                  deviceName: '设备name',
                  status: 0,
                  defectIds: ['缺陷1', '缺陷2'],
                },
                {
                  deviceCode: '设备code2',
                  deviceName: '设备name2',
                  status: 1,
                  defectIds: ['缺陷3', '缺陷4'],
                },
              ],
            },
          ],
          otherDefectIds: ['其他缺陷1', '其他缺陷2'],

        },
        // inspectFlows: response.data.data.flows || [],
        inspectFlows: [
          {
            flowType: 4,
            flowId: '',
            userName: '用户名张三',
            startTime: '2019-11-11',
            endTime: '2019-11-12',
            images: [],
            flowItem: {
              matrixes: [
                {
                  belongMatrix: '方阵1',
                  status: 0,
                  deviceTypes: [
                    {
                      deviceTypeCode: 202,
                      deviceTypeName: '组串逆变器',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
                {
                  belongMatrix: '方阵2',
                  status: 1,
                  deviceTypes: [
                    {
                      deviceTypeCode: 209,
                      deviceTypeName: '气象站',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
              ],
              deviceTypes: [
                {
                  deviceTypeCode: 201,
                  deviceTypeName: '逆变器',
                  unknownNum: 0,
                  normalNum: 4,
                  abnormalNum: 5,
                  devices: [
                    {
                      deviceCode: '设备code',
                      deviceName: '设备name',
                      status: 0,
                      defectIds: ['缺陷1', '缺陷2'],
                    },
                    {
                      deviceCode: '设备code2',
                      deviceName: '设备name2',
                      status: 1,
                      defectIds: ['缺陷3', '缺陷4'],
                    },
                  ],
                },
              ],
              otherDefectIds: ['其他缺陷1', '其他缺陷2'],

            },
          },
          {
            flowType: 5,
            flowId: '',
            userName: '用户名张三',
            startTime: '2019-11-11',
            endTime: '2019-11-12',
            images: [],
            flowItem: {
              matrixes: [
                {
                  belongMatrix: '方阵1',
                  status: 0,
                  deviceTypes: [
                    {
                      deviceTypeCode: 202,
                      deviceTypeName: '组串逆变器',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
                {
                  belongMatrix: '方阵2',
                  status: 1,
                  deviceTypes: [
                    {
                      deviceTypeCode: 209,
                      deviceTypeName: '气象站',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
              ],
              deviceTypes: [
                {
                  deviceTypeCode: 201,
                  deviceTypeName: '逆变器',
                  unknownNum: 0,
                  normalNum: 4,
                  abnormalNum: 5,
                  devices: [
                    {
                      deviceCode: '设备code',
                      deviceName: '设备name',
                      status: 0,
                      defectIds: ['缺陷1', '缺陷2'],
                    },
                    {
                      deviceCode: '设备code2',
                      deviceName: '设备name2',
                      status: 1,
                      defectIds: ['缺陷3', '缺陷4'],
                    },
                  ],
                },
              ],
              otherDefectIds: ['其他缺陷1', '其他缺陷2'],

            },
          },
          {
            flowType: 2,
            flowId: '',
            userName: '用户名张三',
            startTime: '2019-11-11',
            endTime: '2019-11-12',
            images: [],
            flowItem: {
              matrixes: [
                {
                  belongMatrix: '方阵1',
                  status: 0,
                  deviceTypes: [
                    {
                      deviceTypeCode: 202,
                      deviceTypeName: '组串逆变器',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
                {
                  belongMatrix: '方阵2',
                  status: 1,
                  deviceTypes: [
                    {
                      deviceTypeCode: 209,
                      deviceTypeName: '气象站',
                      unknownNum: 2,
                      normalNum: 4,
                      abnormalNum: 5,
                      devices: [
                        {
                          deviceCode: '设备code',
                          deviceName: '设备name',
                          status: 0,
                          defectIds: ['缺陷1', '缺陷2'],
                        },
                        {
                          deviceCode: '设备code2',
                          deviceName: '设备name2',
                          status: 1,
                          defectIds: ['缺陷3', '缺陷4'],
                        },
                      ],
                    },
                  ],
                },
              ],
              deviceTypes: [
                {
                  deviceTypeCode: 201,
                  deviceTypeName: '逆变器',
                  unknownNum: 0,
                  normalNum: 4,
                  abnormalNum: 5,
                  devices: [
                    {
                      deviceCode: '设备code',
                      deviceName: '设备name',
                      status: 0,
                      defectIds: ['缺陷1', '缺陷2'],
                    },
                    {
                      deviceCode: '设备code2',
                      deviceName: '设备name2',
                      status: 1,
                      defectIds: ['缺陷3', '缺陷4'],
                    },
                  ],
                },
              ],
              otherDefectIds: ['其他缺陷1', '其他缺陷2'],

            },
          },
        ],

      },
    });
    // } else {
    //   throw response.data;
    // }
  } catch (e) {
    message.error('获取巡检详情数据失败！');
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}
function* setInspectCheck(action) { // 验收巡检
  const { payload } = action;
  const { inspectId } = payload;
  const url = `${APIBasePath}${ticket.setInspectCheck}`;
  try {
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, { inspectId });
    if (response.data.code === '10000') {
      yield put({
        type: inspectDetailAction.changeStore,
        payload: {
          loading: false,
          selectedRowKeys: [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('验收失败！');
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}

export function* watchInspectDetail() {
  yield takeLatest(inspectDetailAction.getInspectDetail, getInspectDetail);
  yield takeLatest(inspectDetailAction.setInspectCheck, setInspectCheck);
}

