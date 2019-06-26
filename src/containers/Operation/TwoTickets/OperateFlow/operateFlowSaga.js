import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { operateFlowAction } from './operateFlowAction';

function* getFlowList(action) {
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketList}`
    const { listQueryParams, commonQueryParams } = payload;
    const startTime = commonQueryParams.createTimeStart;
    const endTime = commonQueryParams.createTimeEnd;
    const IsMy = commonQueryParams.handleUser ? 1 : 0;
    try {
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                loading: true
            }
        });
        const response = yield call(axios.post, url, { ...listQueryParams, ...commonQueryParams, startTime, endTime, IsMy });
        if (response.data.code === '10000') {
            const totalNum = response.data.data && response.data.data.pageDate.pageCount || 0;
            let { pageNum, pageSize } = payload.listQueryParams;
            const maxPage = Math.ceil(totalNum / pageSize);
            if (totalNum === 0) {
                pageNum = 1;
            } else if (maxPage < pageNum) { // 当前页已超出
                pageNum = maxPage;
            }
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    docketList: response.data.data.pageDate.dataList || [],
                    totalNum,
                    listQueryParams: {
                        ...payload.listQueryParams,
                        pageNum,
                    },
                    commonQueryParams: payload.commonQueryParams,
                    currentRoles: response.data.data.currentRoles || {},
                    loading: false
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
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
            },
        });
    }
}

function* getDocketStatus(action) { // 状态
    const { payload } = action;
    const startTime = payload.createTimeStart;
    const endTime = payload.createTimeEnd;
    const IsMy = payload.handleUser ? 1 : 0;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketStatus}`
    try {
        const response = yield call(axios.post, url, { ...payload, startTime, endTime,IsMy });
        if (response.data.code === '10000') {
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    statusList: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                statusList: [],
            },
        });
    }
}

function* getStopRight(action) {
    const { payload } = action;
    const { templateType } = payload
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.stopNodes}/${templateType}/stopNodes`
    try {
        const response = yield call(axios.get, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    stopRight: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                stopRight: [],
            },
        });
    }
}

function* getDocketTypeList(action) {
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketType}`
    try {
        const response = yield call(axios.get, url);
        if (response.data.code === '10000') {
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    docketTypeList: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                docketTypeList: [],
            },
        });
    }
}

function* getDefectList(action) {  // 缺陷列表
    const { payload } = action;
    const { queryList, defeactData } = payload;
    let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectList;
    yield put({
        type: operateFlowAction.changeWorkFlowStore,
        payload: {
            defeactData: {
                ...defeactData,
                defectLoading: true,
            }
        }
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
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    defeactData: {
                        total,
                        pageNum,
                        pageSize,
                        defectList: response.data.data.defectList,
                        defectLoading: false,
                    }

                }
            });
        } else {
            throw response.data
        }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                defeactData: {
                    total: 0,
                    pageNum: 1,
                    defectList: [],
                    defectLoading: false,
                }
            }
        });
    }
}

function* addDockect(action) {
    const { payload } = action;
    const { isContinueAdd } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.addDocket}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('添加成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            console.log('commonQueryParams', commonQueryParams, listQueryParams)
            if (!isContinueAdd) { // 保持并继续添加
                yield put({
                    type: operateFlowAction.changeWorkFlowStore,
                    payload: {
                        showPage: 'list',
                    }
                })
            }
            yield put({
                type: operateFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data }
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
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    noDistributeList: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
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
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    docketDetail: response.data.data || {},
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                docketDetail: {},
            },
        });
    }
}

function* getNodeImg(action) { // 节点图片
    const { payload } = action;
    const { docketId, nodeCode } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.nodeImg}/${docketId}/${nodeCode}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    nodeImg: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                nodeImg: [],
            },
        });
    }
}

function* getDocketHandle(action) { // 审核/执行/消票 票据
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.getDocketHandle}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('添加成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    showPage: 'list',
                }
            })
            yield put({
                type: operateFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* getNewImg(action) {  // 最新图片
    const { payload } = action;
    const { docketId } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.newImg}/${docketId}`;
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    newImg: response.data.data || [],
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: operateFlowAction.changeWorkFlowStore,
            payload: {
                newImg: [],
            },
        });
    }
}

function* handleBatch(action) {
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.handleBatch}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('操作成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    showPage: 'list',
                }
            })
            yield put({
                type: operateFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* stopBatch(action) {
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.stopBatch}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('操作成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: operateFlowAction.changeWorkFlowStore,
                payload: {
                    showPage: 'list',
                }
            })
            yield put({
                type: operateFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}

function* delDocket(action) {
    const { payload } = action;
    const { docketId } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.operation.delDocket}/${docketId}`
    try {
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            message.success('删除成功');
            const commonQueryParams = yield select(state => state.operation.workFlow.toJS().commonQueryParams);
            const listQueryParams = yield select(state => state.operation.workFlow.toJS().listQueryParams);
            yield put({
                type: operateFlowAction.getFlowList,
                payload: {
                    commonQueryParams,
                    listQueryParams,
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(e.message);
    }
}



export function* watchOperateFlow() {
    yield takeLatest(operateFlowAction.getFlowList, getFlowList);
    yield takeLatest(operateFlowAction.getDocketStatus, getDocketStatus);
    yield takeLatest(operateFlowAction.getStopRight, getStopRight);
    yield takeLatest(operateFlowAction.getDocketTypeList, getDocketTypeList);
    yield takeLatest(operateFlowAction.getDefectList, getDefectList);
    yield takeLatest(operateFlowAction.addDockect, addDockect);
    yield takeLatest(operateFlowAction.noDistributionList, noDistributionList);
    yield takeLatest(operateFlowAction.getDocketDetail, getDocketDetail);
    yield takeLatest(operateFlowAction.getNodeImg, getNodeImg);
    yield takeLatest(operateFlowAction.getDocketHandle, getDocketHandle);
    yield takeLatest(operateFlowAction.getNewImg, getNewImg);
    yield takeLatest(operateFlowAction.handleBatch, handleBatch);
    yield takeLatest(operateFlowAction.stopBatch, stopBatch);
    yield takeLatest(operateFlowAction.delDocket, delDocket);
}
