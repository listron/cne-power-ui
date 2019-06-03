
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Modal, Input, Upload, message } from 'antd';
import moment from 'moment';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './manageCommon.scss';
import path from '../../../../../constants/path';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

export default class HandleComponent extends Component {
  static propTypes = {
    tabName: PropTypes.string,
    stockMaxShow: PropTypes.bool,
    importFileShow: PropTypes.bool,
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
    setStockMax: PropTypes.func,
  }

  state = {
    stockMaxValue: '',
    fileList: [],
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

  showStockMax = () => this.props.changeStore({ stockMaxShow: true })

  hideStockMax = () => this.props.changeStore({ stockMaxShow: false })

  maxStockChange = (e) => {
    this.setState({ stockMaxValue: e.target.value });
  }

  saveStockMax = () => {
    const { stockMaxValue } = this.state;
    const { checkedStocks, setStockMax } = this.props;
    setStockMax({
      inventoryIds: checkedStocks.map(e => e.inventoryId).join(','),
      threshold: stockMaxValue
    });
  }

  toImport = () => this.props.changeStore({ importFileShow: true })

  hideImportModal = () => this.props.changeStore({ importFileShow: false })

  beforeUploadStation = (file) => {
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validFile = validType.includes(file.type);
    console.log(file)
    if (validFile) {
      // this.removeFile(file)
      this.setState(state => ({ fileList: [...state.fileList, file] }));
    } else {
      message.error('只支持上传excel文件!', 2);
    }
    return false;
  }

  removeFile = (file) => {
    console.log(file)
    // this.setState((state) => {
    //   const index = state.fileList.indexOf(file);
    //   const newFileList = state.fileList.slice();
    //   newFileList.splice(index, 1);
      
    //   return {
    //     fileList: newFileList,
    //   };
    // });
  }

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       const { select, upload } = values;
  //       const {fileList}=this.state;
  //       const selectStaionCode = select.length > 0 && select[0].stationCode || '';
  //       const formData = new FormData();
  //       formData.append('file', fileList[0]);
  //       this.props.importStationDevice({ stationCode: selectStaionCode, formData })
  //       this.props.cancelModal()
  //     }
  //   });
  // }

  render(){
    const { stockMaxValue, fileList } = this.state;
    const { tableParams, totalCount, checkedStocks, stockMaxShow, importFileShow } = this.props;
    const { pageSize, pageNum, selectedWarehouse, selectedManufacturer } = tableParams;
    return (
      <div className={styles.handleRow}>
        <div className={styles.leftHandler}>
          <button className={styles.enterWarehouse} onClick={this.toInsert} disabled={checkedStocks.length > 1}>
            <Icon type="plus" className={styles.plus} />
            <span className={styles.text}>入库</span>
          </button>
          <Button disabled={!(checkedStocks.length > 0)} onClick={this.toDelete}>删除</Button>
          <Button disabled={!(checkedStocks.length > 0)} onClick={this.showStockMax}>设置阈值</Button>
          <Button disabled={!(selectedWarehouse || selectedManufacturer)} onClick={this.exportStock}>导出</Button>
          <Button onClick={this.toImport}>导入</Button>
          <Button onClick={this.exportTemplete}>下载导入模板</Button>
        </div>
        <CommonPagination
          total={totalCount}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.onPaginationChange}
        />
        <Modal
          visible={stockMaxShow}
          title="设置阈值"
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
              <Button onClick={this.saveStockMax} disabled={isNaN(stockMaxValue) || !stockMaxValue}>保存</Button>
            </div>
          </div>
        </Modal>
        <Modal
          visible={importFileShow}
          title="批量导入库存"
          onCancel={this.hideImportModal}
          footer={null}
          width={625}
        >
          <Upload
            onRemove={this.removeFile}
            beforeUpload={this.beforeUploadStation}
            fileList={fileList}
            // showUploadList={{showPreviewIcon:false,showRemoveIcon:true}}
          >
            <Button>选择文件</Button>
            <span> 支持xls、xlsx文件</span>
          </Upload>
        </Modal>
      </div>
    )
  }
}

