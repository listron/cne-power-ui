export const scoreAnalysisAction = {
    changeScoreStore: Symbol('changeScoreStore'), // 替换reducer参数  
    changeScoreStoreSaga: Symbol('changeScoreStoreSaga'), // 替换reducer参数  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
    getPvStationType: Symbol('getPvStationType'),
    getScoreList: Symbol('getScoreList'),
    singleStaionScore: Symbol('singleStaionScore'),
}

