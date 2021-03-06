
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Input } from 'antd';
import ImportFile from './ImportFile';
import CommonPagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
import { handleRight } from '@utils/utilFunc';
import styles from './manageCommon.scss';
import path from '../../../../../constants/path';
import CneButton from '@components/Common/Power/CneButton';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

export default class HandleComponent extends Component {
  static propTypes = {
    tabName: PropTypes.string,
    exportTempleteLoading: PropTypes.bool,
    stockMaxShow: PropTypes.bool,
    maxSettingLoading: PropTypes.bool,
    delStockLoading: PropTypes.bool,
    importFileShow: PropTypes.bool,
    totalCount: PropTypes.number,
    warehouseList: PropTypes.array,
    checkedStocks: PropTypes.array,
    tableParams: PropTypes.object,
    changeStore: PropTypes.func,
    showSide: PropTypes.func,
    deleteWarehouseMaterial: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
    downLoadFile: PropTypes.func,
    setStockMax: PropTypes.func,
  }

  state = {
    stockMaxValue: '',
    fileList: [],
    deleteModalShow: false,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 翻页
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    changeStore({
      tableParams: {
        ...tableParams,
        pageNum: currentPage,
        pageSize,
      },
      checkedStocks: [], // 清空选中
    });
    getWarehouseManageList({
      ...tableParams,
      pageNum: currentPage,
      pageSize,
    });
  }

  toInsert = () => {
    const { checkedStocks, showSide, changeStore } = this.props;
    if (checkedStocks.length === 1) { // 选中库存直接再入库
      changeStore({ originInsertInfo: checkedStocks[0] });
    }
    showSide('insert');
  }

  showDelModal = () => {
    this.setState({ deleteModalShow: true });
  }

  cancelDel = () => {
    this.setState({ deleteModalShow: false });
  }

  toDel = () => {
    const { deleteWarehouseMaterial, checkedStocks } = this.props;
    this.setState({ deleteModalShow: false });
    deleteWarehouseMaterial({ checkedStocks });
  }

  exportTemplete = () => { // 导出模板
    const { downLoadFile, tabName } = this.props;
    const stockTypeInfo = {
      spares: [101, '备品备件'],
      tools: [200, '工具'],
      materials: [300, '物资'],
    };
    const url = `${APIBasePath}${operation.downloadStockTemplete}/${stockTypeInfo[tabName][0]}`;
    downLoadFile({
      url,
      method: 'get',
      loadingName: 'exportTempleteLoading',
      fileName: `${stockTypeInfo[tabName][1]}导入模板.xlsx`,
    });
  }

  showStockMax = () => this.props.changeStore({ stockMaxShow: true });

  hideStockMax = () => this.props.changeStore({ stockMaxShow: false });

  maxStockChange = (e) => this.setState({ stockMaxValue: e.target.value });

  saveStockMax = () => {
    const { stockMaxValue } = this.state;
    const { checkedStocks, setStockMax } = this.props;
    setStockMax({
      inventoryIds: checkedStocks.map(e => e.inventoryId).join(','),
      threshold: stockMaxValue,
    });
  }

  toImport = () => this.props.changeStore({ importFileShow: true });

  render() {
    const { stockMaxValue, deleteModalShow } = this.state;
    const {
      tabName, tableParams, totalCount, checkedStocks, stockMaxShow, importFileShow,
      delStockLoading, maxSettingLoading, exportTempleteLoading,
    } = this.props;
    const { pageSize, pageNum } = tableParams;
    const insertDisable = checkedStocks.length > 1;
    const rightBase = {
      spares: handleRight('book_operateSpare'),
      tools: handleRight('book_operateTool'),
      materials: handleRight('book_operateSupply'),
    };
    const warehouseHandleRight = rightBase[tabName];
    return (
      <div className={styles.handleRow}>
        {warehouseHandleRight ? <div className={styles.leftHandler}>
          <CneButton lengthMode="short" className={styles.enterWarehouse} onClick={this.toInsert} disabled={insertDisable}>
            <div className={styles.icon}>
                <span className={'iconfont icon-newbuilt'} />
            </div> 入库
          </CneButton>
          <CneButton lengthMode="short" className={styles.widthBtn}  disabled={!(checkedStocks.length > 0)} onClick={this.showDelModal} loading={delStockLoading}>删除</CneButton>
          {tabName === 'spares' && <CneButton
            lengthMode="short"
            className={styles.widthBtn} 
            disabled={!(checkedStocks.length > 0)}
            onClick={this.showStockMax}
          >设置阈值</CneButton>}
          <CneButton  lengthMode="short" className={styles.widthBtn} onClick={this.toImport}>导入</CneButton>
          <CneButton onClick={this.exportTemplete} loading={exportTempleteLoading}>下载导入模板</CneButton>
        </div> : <div />}
        <CommonPagination
          total={totalCount}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.onPaginationChange}
        />
        <Modal
          visible={stockMaxShow}
          title="设置阈值"
          maskClosable={false}
          onCancel={this.hideStockMax}
          footer={null}
          width={740}
        >
          <div className={styles.maxStock}>
            <div className={styles.editPart}>
              <span className={styles.text}>库存阈值</span>
              <Input onChange={this.maxStockChange} placeholder="请输入数字" />
              {isNaN(stockMaxValue) && <span className={styles.error}>请输入数字</span>}
            </div>
            <div className={styles.savePart}>
              <span className={styles.holder} />
              <CneButton
                className={styles.saveButton}
                onClick={this.saveStockMax}
                disabled={isNaN(stockMaxValue) || !stockMaxValue}
                loading={maxSettingLoading}
              >保存</CneButton>
            </div>
          </div>
        </Modal>
        {importFileShow && <ImportFile {...this.props} />}
        {deleteModalShow && <WarningTip onOK={this.toDel} onCancel={this.cancelDel} value="是否确认删除?" />}
      </div>
    );
  }
}

