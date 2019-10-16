import { put, takeLatest } from 'redux-saga/effects';
import { workStageAction } from './workStageReducer';
import request from '@utils/request';
import path from '@path';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;


function* easyPut(actionName, payload){ //
  yield put({
    type: examinerAction[actionName],
    payload,
  });
}

// /api/v3/service/workbench/list 	工作台-今日工作
// /api/v3/service/workbench/run 	工作台-运行记录
// /api/v3/service/workbench/work 	工作台-两票三制记录
// /api/v3/service/workbench/calendar  工作台-计划日历
// /api/v3/service/task/complete  工作记事 => 操作任务为已完成
// /api/v3/service/task/{taskId}   工作记事 => 查看任务详情
// /api/v3/service/task/future  工作台日历任务批量下发/删除
// /api/v3/service/workbench/inspect/defect  新增工作记事
// /api/v3/service/worknote 编辑工作记事
// /api/v3/service/worknote/{noteId} 删除工作记事
// /api/v3/service/worknote/{noteId} 工作记事详情
// /api/v3/service/inspect/plan 新增工作计划

// function *getOverviewStation({ payload }){ // 电站基础数据信息 - 各页面单独存储一份
//   try {
//     const { stationCode, pageKey } = payload || {};
//     const url = `${APIBasePath}${monitor.getOverviewStation}/${stationCode}`;
//     const response = yield call(request.get, url);
//     if (response.code === '10000') {
//       yield call(easyPut, 'fetchSuccess', {
//         [`${pageKey}TopData`]: response.data || {}, // 根据不同页面，生成: stationTopData, deviceTopData, pointTopData
//         [`${pageKey}Unix`]: moment().unix(),
//       });
//     } else { throw response; }
//   } catch (error) {
//     console.log(error);
//     message.error('获取电站基础信息失败, 请刷新重试');
//   }
// }

export function* watchWorkStage() {
  // yield takeLatest(examinerAction.getSettingList, getSettingList);
}

