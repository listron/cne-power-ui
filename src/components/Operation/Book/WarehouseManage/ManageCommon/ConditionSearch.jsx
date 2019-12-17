import React, { Component } from 'react';
import { Select, Button } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';
import path from '../../../../../constants/path';
import { handleRight } from '@utils/utilFunc';
const { Option } = Select;
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

class ConditionSearch extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    warehouseList: PropTypes.array,
    manufacturerList: PropTypes.array,
    modeList: PropTypes.array,
    tableParams: PropTypes.object,
    stocksList: PropTypes.array,
    exportInfoLoading: PropTypes.bool,
    downLoadFile: PropTypes.func,
    getModes: PropTypes.func,
    changeStore: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
  }

  changeWarehouse = (selectedWarehouse) => {
    const { getWarehouseManageList, changeStore, tableParams } = this.props;
    const newParams = {
      ...tableParams,
      selectedWarehouse,
      pageNum: 1,
    };
    changeStore({ tableParams: newParams, checkedStocks: [] });
    getWarehouseManageList(newParams);
  }

  changeManufacturer = (selectedManufacturer) => {
    const { getWarehouseManageList, changeStore, tableParams, getModes } = this.props;
    const newParams = {
      ...tableParams,
      selectedManufacturer,
      selectedMode: undefined,
      pageNum: 1,
    };
    changeStore({ tableParams: newParams, checkedStocks: [] });
    !!selectedManufacturer && getModes({ selectedManufacturer });
    getWarehouseManageList(newParams);
  }

  changeMode = (selectedMode) => {
    const { getWarehouseManageList, changeStore, tableParams } = this.props;
    const newParams = {
      ...tableParams,
      selectedMode,
      pageNum: 1,
    };
    changeStore({ tableParams: newParams, checkedStocks: [] });
    getWarehouseManageList(newParams);
  }

  exportStock = () => { // 导出仓库内各库存信息
    const { downLoadFile, tabName, tableParams, warehouseList } = this.props;
    const url = `${APIBasePath}${operation.exportStockFile}`;
    const { selectedWarehouse, selectedManufacturer, selectedMode } = tableParams;
    const stockTypeInfo = {
      spares: [101, '备品备件'],
      tools: [200, '工具'],
      materials: [300, '物资'],
    };
    const warehouseName = warehouseList.find(e => e.warehouseId === selectedManufacturer) || {};
    downLoadFile({
      url,
      loadingName: 'exportInfoLoading',
      fileName: `${warehouseName.warehouseName}-${stockTypeInfo[tabName][1]}库${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`,
      params: {
        goodsMaxType: stockTypeInfo[tabName][0],
        warehouseId: selectedWarehouse,
        manufactorId: selectedManufacturer,
        modeId: selectedMode,
      },
    });
  }

  render(){
    const { warehouseList = [], manufacturerList = [], modeList = [], tableParams = {}, tabName, stocksList = [], exportInfoLoading } = this.props;
    const { selectedWarehouse, selectedManufacturer, selectedMode } = tableParams;
    const rightBase = {
      spares: handleRight('book_operateSpare'),
      tools: handleRight('book_operateTool'),
      materials: handleRight('book_operateSupply'),
    };
    const warehouseHandleRight = rightBase[tabName];
    return (
      <div className={styles.conditionSearch}>
        <div className={styles.searchParts}>
          <span className={styles.title}>条件查询</span>
          <Select
            placeholder="请选择仓库"
            onChange={this.changeWarehouse}
            value={selectedWarehouse}
            disabled={!(warehouseList.length > 0)}
          >
            <Option key={null} value={null}>不限仓库</Option>
            {warehouseList.map(e => (
              <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
            ))}
          </Select>
          {tabName === 'spares' && <Select
            placeholder="请选择厂家"
            onChange={this.changeManufacturer}
            value={selectedManufacturer}
            disabled={!(manufacturerList.length > 0)}
          >
            <Option key={null} value={null}>不限厂家</Option>
            {manufacturerList.map(e => (
              <Option key={e.id} value={e.id}>{e.name}</Option>
            ))}
          </Select>}
          {tabName === 'spares' && <Select
            placeholder="请选择型号"
            onChange={this.changeMode}
            value={selectedMode}
            disabled={!(modeList.length > 0)}
          >
            <Option key={null} value={null}>不限型号</Option>
            {modeList.map(e => (
              <Option key={e.id} value={e.id}>{e.name}</Option>
            ))}
          </Select>}
        </div>
        {warehouseHandleRight && <Button
          className={styles.export}
          disabled={!selectedWarehouse || stocksList.length === 0}
          onClick={this.exportStock}
          loading={exportInfoLoading}
        >导出</Button>}
      </div>
    );
  }
}

export default ConditionSearch;
