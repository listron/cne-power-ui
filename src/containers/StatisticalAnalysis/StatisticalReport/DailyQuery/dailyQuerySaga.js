import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dailyQueryAction } from './dailyQueryAction';

const { APIBasePath } = Path.basePaths;
const { statisticalAnalysis } = Path.APISubPaths;




const dataArr = (data) => {
  if (!data.list) {
    return { ...data, children: data.list, label: data.desc, value: data.code };
  }
  const children = data.list.map(e => {
    return dataArr(e);
  });
  return { ...data, children, label: data.desc, value: data.code };
};

function* getQuota({ payload = {} }) { // 获取指标
  const { stationType } = payload;
  const url = `${APIBasePath}${statisticalAnalysis.getQuota}/${stationType}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      const quotaData=response.data.data && response.data.data.map(cur=>{
        return dataArr(cur);
      });
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          quotaData: quotaData,
        },
      });
      }else {
        throw response.data;
      }
  }catch(e) {
    message.error('获取关键指标数据失败！');
    console.log(e);
  }
}

// function *getQuotaList({ payload = {} }) { // 关键指标列表
//   const url = `${APIBasePath}${statisticalAnalysis.getQuotaList}`;
//   try{
//     yield put({
//       type: dailyQueryAction.changeDailyQueryStore,
//       payload: {
//         tableLoading: true,
//       },
//     });
//     const response = yield call(axios.post, url, {...payload});
//     const { total = 0 } = response.data.data;
//     let { pageNum, pageSize } = payload;
//     const maxPage = Math.ceil(total / pageSize);
//     if (total === 0) {
//       pageNum = 1;
//     } else if (maxPage < pageNum) {
//       pageNum = maxPage;
//     }
//     if (response.data.code === '10000') {
//       yield put({
//         type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
//         payload: {
//           listParams: {
//             ...payload,
//             pageNum,
//             pageSize,
//           },
//           tableLoading: false,
//           quotaListData: response.data.data || {},
//         },
//       });
//     } else {
//       throw response.data;
//     }
//   }catch(error) {
//     message.error('获取关键指标列表信息失败!');
//     yield put({
//       type: dailyQueryAction.changeDailyQueryStore,
//       payload: { tableLoading: false },
//     });
//     console.log(error);
//   }
// }

export function* watchDailyQuery() {
  yield takeLatest(dailyQueryAction.getQuota, getQuota);
  // yield takeLatest(dailyQueryAction.getQuotaList, getQuotaList);
}
