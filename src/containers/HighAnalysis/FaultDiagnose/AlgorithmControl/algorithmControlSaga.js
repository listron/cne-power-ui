import { put, takeLatest } from 'redux-saga/effects';
import { algorithmControlAction } from './algorithmControlAction';

function* changeFaultWarnStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: algorithmControlAction.changeHistoryWarnStore,
    payload,
  })
}

//获取巡检列表信息
function* getInspectList(action) {
  const { payload } = action;
  console.log('fewjlfwejls')
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectionList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 0;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          ...payload,
          total,
          pageNum,
          inspectStatusStatistics: response.data.data.inspectStatusStatistics,
          inspectList: response.data.data.inspectList,
          selectedRowKeys: [],
        }

      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* resetStore() {
  yield put({
    type: algorithmControlAction.RESET_STORE
  })
}

export function* watchAlgorithmControl() {
  yield takeLatest(algorithmControlAction.resetStore, resetStore);
  yield takeLatest(algorithmControlAction.GET_INSPECT_LIST_SAGA, getInspectList);

}

