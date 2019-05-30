import Immutable from 'immutable';

const warehouseManageAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changStore: Symbol('changStore'),
  resetStore: Symbol('resetStore'),
}

const tableParams = { // 表格共有的请求
  selectedWarehouse: null,
  selectedTool: null,
  selectedMaterials: null,
  pageSize: 10,
  pageNum: 1,
  orderName: '',
  orderType: 'ascend',
}

const initState = Immutable.fromJS({
  tabName: 'spares', // tab页控制 spares-备品, tools-工具, materials-物资
  sideKey: 'list', // 抽屉页控制 list-主页面, insert-入, takeOut-出, reserve-库存
  tableParams: { ...tableParams }, // 表格请求参数
  // sparesParams: { ...tableParams },
  // toolsParams: { ...tableParams },
  // materialsParams: { ...tableParams },

  warehouseList: [], // 仓库列表
  manufacturerList: [], // 厂家列表
  modeList: [], // 型号列表


  sparesData: [], // 备品备件表格
  toolsData: [], // 工具数据表格
  materialsData: [], // 物资数据表格
});


const warehouseManage = (state = initState, action) => {
  switch (action.type) {
    case warehouseManageAction.fetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.changStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.resetStore:
      return initState
  }
  return state;
};

export { warehouseManage, warehouseManageAction };
