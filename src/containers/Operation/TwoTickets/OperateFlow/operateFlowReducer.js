import Immutable from 'immutable';
import { operateFlowAction } from './operateFlowAction';
import Cookie from 'js-cookie';

var initState = Immutable.fromJS({
    loading: false,
    username: Cookie.get('username'),
    userFullName: Cookie.get('userFullName'),
    showPage: 'list', // list detail edit add
    commonQueryParams: {
        templateType: 2, // 操作票2 工作票1
        stationCodes: [],
        startTime: null,
        endTime: null,
        IsMy: 0,
        stateCode: '',
    },
    listQueryParams: {
        sortField: 'create_time',
        sortMethod: 'desc',
        pageNum: 1,
        pageSize: 10,
    },
    totalNum: 0,
    flowList: [], //工作票列表
    docketList: [], //  工作票列表
    currentRoles: {}, // 当前用户角色
    statusList: [], //状态
    stopRight: [], // 中断操作功能
    defeactData: {
        defectLoading: false, // 缺陷列表页loading
        defectList: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
    },
    noDistributeList: [], // 未分配人员电站
    docketId: null, // 工作票ID
    docketDetail: {}, // 工作票详情
    nodeImg: [], // 节点图片
    userId: Cookie.get('userId'),
    newImg: [], // 最新的照片
});

const operateFlowReducer = (state = initState, action) => {
    switch (action.type) {
        case operateFlowAction.changeFlowStore:
            return state.merge(Immutable.fromJS(action.payload));
        case operateFlowAction.resetStore:
            return initState;
    }
    return state;
};

export default operateFlowReducer;
