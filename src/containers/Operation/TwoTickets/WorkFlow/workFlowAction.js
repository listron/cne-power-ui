export const workFlowAction = {
    changeWorkFlowStore: Symbol('changeWorkFlowStore'), // 替换reducer参数
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    getFlowList: Symbol('getFlowList'), 
    getStopRight: Symbol('getStopRight'), 
    getDocketTypeList: Symbol('getDocketTypeList'), 
    getDefectList: Symbol('getDefectList'), 
    addDockect: Symbol('addDockect'), 
    noDistributionList: Symbol('noDistributionList'), 
    getDocketDetail: Symbol('getDocketDetail'), 
    getNodeImg: Symbol('getNodeImg'), 
    getDocketHandle: Symbol('getDocketHandle'), 
    getNewImg: Symbol('getNewImg'), 
    handleBatch: Symbol('handleBatch'), 
    stopBatch: Symbol('stopBatch'), 
    delDocket: Symbol('delDocket'), 
  }