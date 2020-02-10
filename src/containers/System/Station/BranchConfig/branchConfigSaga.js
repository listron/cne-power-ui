
import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { branchConfigAction } from './branchConfigAction';
import { message } from 'antd';

const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function* getAvailableDeviceType({ payload = {} }) { // 获取可用设备类型
  const { stationCode } = payload;
  const sortTypes = [ // 电站默认排序顺序
    '风电机组', '集中式逆变器', '组串式逆变器', '集电线路', '箱变', '汇流箱', '气象站', '站内母线', '主变', '站用变', '接地变', '测风塔', '全场信息汇总', '电能采集', '主进线', '功率预测系统', '能量管理平台', 'SVG', '母线分段', '馈线', '直流屏', '孤岛保护',
  ];
  try {
    const url = `${APIBasePath}${monitor.getAvailableDeviceType}/${stationCode}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const stationDeviceTypes = response.data.data || [];

      stationDeviceTypes.sort((a, b) => {
        const tmpIndexA = sortTypes.indexOf(a.deviceTypeName);
        const tmpIndexB = sortTypes.indexOf(b.deviceTypeName);
        if (tmpIndexA === -1) {
          return 1;
        }
        if (tmpIndexB === -1) {
          return -1;
        }
        return (tmpIndexA - tmpIndexB);
      });
      const defaultTypes = stationDeviceTypes.find(e => e.deviceTypeCode); // 默认选中第一个设备类型名称
      yield put({
        type: branchConfigAction.GET_HISTORY_SUCCESS,
        payload: {
          stationDeviceTypes,
          deviceTypeCode: defaultTypes ? defaultTypes.deviceTypeCode : null,
        },
      });
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error);
  }
}
export function* watchPvDataHistoryMonitor() {
  yield takeLatest(branchConfigAction.getAvailableDeviceType, getAvailableDeviceType);

}
