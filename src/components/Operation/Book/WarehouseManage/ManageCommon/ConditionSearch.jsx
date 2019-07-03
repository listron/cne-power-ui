import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';
const { Option } = Select;

class ConditionSearch extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    warehouseList: PropTypes.array,
    manufacturerList: PropTypes.array,
    modeList: PropTypes.array,
    tableParams: PropTypes.object,
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

  render(){
    const { warehouseList = [], manufacturerList = [], modeList = [], tableParams = {}, tabName } = this.props;
    const { selectedWarehouse, selectedManufacturer, selectedMode } = tableParams;
    return (
      <div className={styles.conditionSearch}>
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
    );
  }
}

export default ConditionSearch;
