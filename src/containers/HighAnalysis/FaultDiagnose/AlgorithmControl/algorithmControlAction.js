export const algorithmControlAction = {
  changeAlgorithmControlStore: Symbol('changeAlgorithmControlStore'), // 替换reducer参数
  fetchAlgorithmControlSuccess: Symbol('fetchAlgorithmControlSuccess'), // 请求成功

  GET_INSPECT_LIST_SAGA: Symbol('GET_INSPECT_LIST_SAGA'),
  GET_INSPECT_ID_LIST_SAGA: Symbol('GET_INSPECT_ID_LIST_SAGA'),
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
