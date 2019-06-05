import Immutable from 'immutable';

const warehouseManageAction = {
  getWarehouses: Symbol('getWarehouses'),
  getManufactures: Symbol('getManufactures'),
  getModes: Symbol('getModes'),
  getWarehouseManageList: Symbol('getWarehouseManageList'),
  deleteWarehouseMaterial: Symbol('deleteWarehouseMaterial'),
  importStockFile: Symbol('importStockFile'),
  setStockMax: Symbol('setStockMax'),
  getGoodsList: Symbol('getMaterialList'),
  addNewGood: Symbol('addGoodSuccess'),
  getAssetslist: Symbol('getAssetslist'),
  insertWarehouse: Symbol('insertWarehouse'),
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
}

const tableParams = { // 表格共有的请求
  selectedWarehouse: undefined, //  仓库
  selectedManufacturer: undefined, // 厂家
  selectedMode: undefined, // 型号
  pageSize: 10,
  pageNum: 1,
  sortField: 'goods_name', // 物品名称：goods_name | 库存类型：goods_type |仓库名称：warehouse_name | 库存数量：inventory_num | 最低阈值：threshold | 厂家：devManufactorName | 供货商：supplier_name | 制造商：manufactor_name
  sortMethod: 'desc', // "asc"：正序  "desc"：倒序
}

const initState = Immutable.fromJS({
  tabName: 'spares', // tab页控制 spares-备品, tools-工具, materials-物资
  sideKey: 'insert', // 抽屉页控制 list-主页面, insert-入, takeOut-出, reserve-库存
  stockMaxShow: false, // 阈值设置弹框
  importFileShow: false, // 导入库存文件
  tableParams: { ...tableParams }, // 表格请求参数

  warehouseList: [], // 仓库列表
  manufacturerList: [], // 厂家列表
  modeList: [], // 型号列表
  stocksList: [], // 备品备件 | 工具数据 | 物资表格
  totalCount: 0, // 备品备件 | 工具数据 | 物资表格 数据总条数
  checkedStocks: [], // 备品备件 | 工具数据 | 物资表格选中项集合
  goodsList: [], // 仓库下所有物品列表
  originInsertInfo: null, // 入库对象基础信息(新入库null, 再入库{...})
  addGoodName: '', // 新添加物品的名称
  insertModes: [], // 入库的型号列表
  assetsTree: [], // 入库资产树
  insertStatus: 'normal', // 'loading', 'success' =>控制loading + 状态判定
  // sparesData: [], // 备品备件表格
  // toolsData: [], // 工具数据表格
  // materialsData: [], // 物资数据表格
});

const warehouseManage = (state = initState, action) => {
  switch (action.type) {
    case warehouseManageAction.fetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.changeStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.resetStore:
      return initState
  }
  return state;
};

export { warehouseManage, warehouseManageAction };
