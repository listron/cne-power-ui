import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { workFlowAction } from './workFlowAction';

function* getFlowList(action) {
    const { payload } = action;
    const flowListUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketList}`;
    const flowStatusUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketStatus}`;
    const { listQueryParams, commonQueryParams } = payload;
    try {
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                loading: true,
            },
        });
        const [flowList, flowStatus] = yield all(
            [call(axios.post, flowListUrl, { ...listQueryParams, ...commonQueryParams }),
            call(axios.post, flowStatusUrl, commonQueryParams)]);
        if (flowList.data.code === '10000' && flowStatus.data.code === '10000') {
            const totalNum = flowList.data.data && flowList.data.data.pageDate.pageCount || 0;
            let { pageNum, pageSize } = payload.listQueryParams;
            const maxPage = Math.ceil(totalNum / pageSize);
            if (totalNum === 0) {
                pageNum = 1;
            } else if (maxPage < pageNum) { // 当前页已超出
                pageNum = maxPage;
            }
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    docketList: flowList.data.data.pageDate.dataList || [],
                    totalNum,
                    listQueryParams: {
                        ...payload.listQueryParams,
                        pageNum,
                    },
                    commonQueryParams: payload.commonQueryParams,
                    currentRoles: flowList.data.data.currentRoles || {},
                    loading: false,
                    statusList: flowStatus.data.data || [],
                },
            });
        } else { throw flowList.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                docketList: [],
                totalNum: 0,
                currentRoles: {},
                loading: false,
                listQueryParams: {
                    ...payload.listQueryParams,
                    pageNum: 1,
                },
                commonQueryParams: payload.listQueryParams,
                statusList: [],
            },
        });
    }
}

function* getStopRight(action) {
    const { payload } = action;
    const { templateType } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.stopNodes}/${templateType}/stopNodes`;
    try {
        const response = yield call(axios.get, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    stopRight: response.data.data || [],
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                stopRight: [],
            },
        });
    }
}

function* getDocketTypeList(action) {
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketType}`;
    try {
        const response = yield call(axios.get, url);
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    docketTypeList: response.data.data || [],
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                docketTypeList: [],
            },
        });
    }
}

function* getDefectList(action) { // 缺陷列表
    const { payload } = action;
    const { queryList, defeactData } = payload;
    const url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectList;
    yield put({
        type: workFlowAction.changeFlowStore,
        payload: {
            defeactData: {
                ...defeactData,
                defectLoading: true,
            },
        },
    });
    try {
        const response = yield call(axios.post, url, queryList);
        if (response.data.code === '10000') {
            const total = response.data.data.total || 0;
            let { pageNum, pageSize } = queryList;
            const maxPage = Math.ceil(total / pageSize);
            if (total === 0) {
                pageNum = 1;
            } else if (maxPage < pageNum) { // 当前页已超出
                pageNum = maxPage;
            }
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    defeactData: {
                        total,
                        pageNum,
                        pageSize,
                        defectList: response.data.data.defectList,
                        defectLoading: false,
                    },

                },
            });
        } else {
            throw response.data;
        }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                defeactData: {
                    total: 0,
                    pageNum: 1,
                    defectList: [],
                    defectLoading: false,
                },
            },
        });
    }
}

function* addDockect(action) {
    const { payload } = action;
    const { isContinueAdd, func, ...params } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.addDocket}`;
    try {
        const response = yield call(axios.post, url, params);
        if (response.data.code === '10000') {
            message.success('添加成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            if (!isContinueAdd) { // 保持并继续添加
                yield put({
                    type: workFlowAction.changeFlowStore,
                    payload: {
                        showPage: 'list',
                    },
                });
            }
            if (isContinueAdd) {
                func();
            }
            yield put({
                type: workFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* noDistributionList(action) {
    const { payload } = action;
    const templateType = 1;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.noDistribution}/${templateType}`;
    try {
        const response = yield call(axios.post, url, { templateType });
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    noDistributeList: response.data.data || [],
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                noDistributeList: [],
            },
        });
    }

}

function* getDocketDetail(action) {
    const { payload } = action;
    const { docketId } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketDetail}/${docketId}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    docketDetail: response.data.data || {},
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                docketDetail: {},
            },
        });
    }
}

function* getNodeImg(action) { // 节点图片
    const { payload } = action;
    const { docketId, taskId } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.nodeImg}/${docketId}/${taskId}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    nodeImg: response.data.data || [],
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                nodeImg: [],
            },
        });
    }
}

function* getDocketHandle(action) { // 审核/执行/消票 票据
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketHandle}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('添加成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    showPage: 'list',
                },
            });
            yield put({
                type: workFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* getNewImg(action) { // 最新图片
    const { payload } = action;
    const { docketId } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.newImg}/${docketId}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    newImg: response.data.data || [],
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        yield put({
            type: workFlowAction.changeFlowStore,
            payload: {
                newImg: [],
            },
        });
    }
}

function* handleBatch(action) {
    const { payload } = action;
    const { func, ...params } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.handleBatch}`;
    try {
        const response = yield call(axios.post, url, params);
        if (response.data.code === '10000') {
            message.success('操作成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            func();
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    showPage: 'list',
                },
            });
            yield put({
                type: workFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* stopBatch(action) {
    const { payload } = action;
    const { func, ...params } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.stopBatch}`;
    try {
        const response = yield call(axios.post, url, params);
        if (response.data.code === '10000') {
            message.success('操作成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: workFlowAction.changeFlowStore,
                payload: {
                    showPage: 'list',
                },
            });
            func();
            yield put({
                type: workFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* delDocket(action) {
    const { payload } = action;
    const { docketId, func } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.delDocket}/${docketId}`;
    try {
        const response = yield call(axios.get, url, payload);
        if (response.data.code === '10000') {
            message.success('删除成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            func();
            yield put({
                type: workFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data; }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}



export function* watchWorkFlow() {
    yield takeLatest(workFlowAction.getFlowList, getFlowList);
    yield takeLatest(workFlowAction.getStopRight, getStopRight);
    yield takeLatest(workFlowAction.getDocketTypeList, getDocketTypeList);
    yield takeLatest(workFlowAction.getDefectList, getDefectList);
    yield takeLatest(workFlowAction.addDockect, addDockect);
    yield takeLatest(workFlowAction.noDistributionList, noDistributionList);
    yield takeLatest(workFlowAction.getDocketDetail, getDocketDetail);
    yield takeLatest(workFlowAction.getNodeImg, getNodeImg);
    yield takeLatest(workFlowAction.getDocketHandle, getDocketHandle);
    yield takeLatest(workFlowAction.getNewImg, getNewImg);
    yield takeLatest(workFlowAction.handleBatch, handleBatch);
    yield takeLatest(workFlowAction.stopBatch, stopBatch);
    yield takeLatest(workFlowAction.delDocket, delDocket);
}
