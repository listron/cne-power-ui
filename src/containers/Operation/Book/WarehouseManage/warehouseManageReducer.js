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
  addNewManu: Symbol('addNewManu'),
  addNewType: Symbol('addNewType'),
  getWarehouseStationType: Symbol('getWarehouseStationType'),
  getAssetsManufacture: Symbol('getAssetsManufacture'),
  insertWarehouse: Symbol('insertWarehouse'),
  getMaterialDetailsList: Symbol('getMaterialDetailsList'),
  takeoutWarehouseMaterial: Symbol('takeoutWarehouseMaterial'),
  getReserveDetail: Symbol('getReserveDetail'),
  getReserveList: Symbol('getReserveList'),
  deleteReserveInfo: Symbol('deleteReserveInfo'),
  recallReserveInfo: Symbol('recallReserveInfo'),
  getMainDeviceEditCodes: Symbol('getMainDeviceEditCodes'),
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
};

const initState = Immutable.fromJS({
  tabName: 'spares', // tab页控制 spares-备品, tools-工具, materials-物资
  sideKey: 'list', // 抽屉页控制 list-主页面, insert-入, takeout-出, reserve-库存
  stockMaxShow: false, // 阈值设置弹框
  importFileShow: false, // 导入库存文件
  tableParams: { // 表格请求参数
    selectedWarehouse: undefined, //  仓库
    selectedManufacturer: undefined, // 厂家
    selectedMode: undefined, // 型号
    pageSize: 10,
    pageNum: 1,
    sortField: 'warehouse_name', // 物品名称：goods_name | 库存类型：goods_type |仓库名称：warehouse_name | 库存数量：inventory_num | 最低阈值：threshold | 厂家：devManufactorName | 供货商：supplier_name | 制造商：manufactor_name
    sortMethod: 'asc', // "asc"：正序  "desc"：倒序
  },
  warehouseList: [], // 仓库列表
  manufacturerList: [], // 厂家列表
  modeList: [], // 型号列表
  stocksList: [], // 备品备件 | 工具数据 | 物资表格
  stocksListLoading: false, // 主页面表格loading态
  totalCount: 0, // 备品备件 | 工具数据 | 物资表格 数据总条数
  checkedStocks: [], // 备品备件 | 工具数据 | 物资表格选中项集合
  goodsList: [], // 仓库下所有物品列表
  originInsertInfo: null, // 入库对象基础信息(新入库null, 再入库{...})
  addGoodName: '', // 新添加物品的名称
  addGoodStatus: 'normal', // 保存新增物品的状态: 'loading' ,'success';
  addManufactorId: '', // 新增厂家id
  addManuStatus: 'normal', // 厂家新增的状态: 'loading' ,'success';
  adddModeName: '', // 新增型号name
  addTypeStatus: 'normal', // 新增型号状态: 'loading' ,'success';
  insertModes: [], // 入库的型号列表
  assetsTree: [], // 入库资产树
  assetsManufac: [], // 指定生产资产下的厂家。 
  delStockLoading: false, // 删除库存loading状态
  maxSettingLoading: false, // 阈值设置loading
  exportInfoLoading: false, // 导出表格内容loading态
  exportTempleteLoading: false, // 导出模板loading态
  importLoading: false, // 导入loading态
  insertStatus: 'normal', // 'loading', 'success' =>控制loading + 状态判定
  originTakeoutInfo: {}, // 出库对象基本信息
  materialDetailsList: [], // 出库操作 选定库存对应所有物资列表
  takeoutStatus: 'normal', // 'loading', 'success' =>控制loading + 状态判定
  reserveInventoryId: null, // 查看库存对象的id
  reserveDetail: {}, // 库存对象基本信息
  reserveParams: { // 库存列表请求参数
    pageNum: 1,
    pageSize: 10,
    sortField: 'entry_time', // 单价：price, 入库人：username, 入库时间：entry_time, 出库时间：we_entry_time, 状态：is_entry
    sortMethod: 'desc', // 'asc'：正序  'desc'：倒序
  },
  materialListLoading: false, // 物资列表loading
  materialListParams: { // 库存物资列表表格
    sortField: 'price', // 'price'
    sortMethod: 'asc', // "asc"：正序  "desc"：倒序
    pageNum: 1,
    pageSize: 10,
  },
  materialListTotal: 0, // 库存物资列表总数.
  reserveListLoading: false, // 库存列表loading
  reserveListInfo: {}, // 库存对象统计列表信息
  mainDeviceEditCodes: [], // 可编辑主设备类型企业codes
});

const warehouseManage = (state = initState, action) => {
  switch (action.type) {
    case warehouseManageAction.fetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.changeStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseManageAction.resetStore:
      return initState;
  }
  return state;
};

export { warehouseManage, warehouseManageAction };
