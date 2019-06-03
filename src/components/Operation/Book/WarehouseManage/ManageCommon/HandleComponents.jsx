
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import moment from 'moment';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './manageCommon.scss';
import path from '../../../../../constants/path';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

export default class HandleComponent extends Component {
  static propTypes = {
    tabName: PropTypes.string,
    totalCount: PropTypes.number,
    warehouseList: PropTypes.array,
    stocksList: PropTypes.array,
    checkedStocks: PropTypes.array,
    tableParams: PropTypes.object,
    changeStore: PropTypes.func,
    showSide: PropTypes.func,
    deleteWarehouseMaterial: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
    downLoadFile: PropTypes.func,
  }

  onPaginationChange = ({pageSize, currentPage}) => { // 翻页
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    changeStore({
      pageNum: currentPage,
      pageSize,
      checkedStocks: [], // 清空选中
    });
    getWarehouseManageList({
      ...tableParams,
      pageNum: currentPage, 
      pageSize
    });
  }

  toInsert = () => this.props.showSide({ sideKey: 'insert' });

  toDelete = () => {
    const { deleteWarehouseMaterial, checkedStocks } = this.props;
    deleteWarehouseMaterial({ checkedStocks });
  }

  exportStock = () => { // 导出仓库内各库存信息
    const { downLoadFile, tabName, tableParams, warehouseList } = this.props;
    const url = `${APIBasePath}${operation.exportStockFile}`;
    const { selectedWarehouse, selectedManufacturer, selectedMode } = tableParams;
    const stockTypeInfo = {
      spares: [101, '备品备件'],
      tools: [200, '工具'],
      materials: [300, '物资']
    }
    const warehouseName = warehouseList.find(e => e.warehouseId === selectedManufacturer) || {};
    downLoadFile({
      url,
      fileName: `${warehouseName.warehouseName}-${stockTypeInfo[tabName][1]}库${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`,
      params: {
        goodsMaxType: stockTypeInfo[tabName][0],
        warehouseId: selectedWarehouse,
        manufactorId: selectedManufacturer,
        modeId: selectedMode,
      },
    })
  }

  exportTemplete = () => { // 导出模板
    const { downLoadFile, tabName } = this.props;
    const url = `${APIBasePath}${operation.downloadStockTemplete}`;
    const stockTypeInfo = {
      spares: [101, '备品备件'],
      tools: [200, '工具'],
      materials: [300, '物资'],
    }
    downLoadFile({
      url,
      fileName: `${stockTypeInfo[tabName][1]}导入模板.xlsx`,
      params: {
        goodsMaxType: stockTypeInfo[tabName][0],
      },
    })
  }

  render(){
    const { tableParams, totalCount, checkedStocks } = this.props;
    const { pageSize, pageNum, selectedWarehouse, selectedManufacturer } = tableParams;
    return (
      <div className={styles.handleRow}>
        <div className={styles.leftHandler}>
          <button className={styles.enterWarehouse} onClick={this.toInsert} disabled={checkedStocks.length > 1}>
            <Icon type="plus" className={styles.plus} />
            <span className={styles.text}>入库</span>
          </button>
          <Button disabled={!(checkedStocks.length > 0)} onClick={this.toDelete}>删除</Button>
          <Button disabled={!(selectedWarehouse || selectedManufacturer)} onClick={this.exportStock}>导出</Button>
          <Button onClick={this.exportTemplete}>下载导入模板</Button>
        </div>
        <CommonPagination
          total={totalCount}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.onPaginationChange}
        />
      </div>
    )
  }
}

