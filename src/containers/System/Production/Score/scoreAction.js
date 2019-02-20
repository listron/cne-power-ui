export const scoreAction = {
    changeScoreStore: Symbol('changeWarnStore'), // 替换reducer参数  
    changeScoreStoreSaga: Symbol('changeWarnStoreSaga'), // 替换reducer参数  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
    getScoreConfig: Symbol('getScoreConfig'), // 评分配置查询
    editScoreConfig: Symbol('editScoreConfig'), // 评分配置查询
    changeIsVaild: Symbol('changeIsVaild'), 
}

