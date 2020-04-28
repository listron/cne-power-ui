import React, { Component } from 'react';
import { Modal, Upload, message, Select, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';
import CneButton from '@components/Common/Power/CneButton';
const { Option } = Select;

export default class ImportFile extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    importLoading: PropTypes.bool,
    importFileShow: PropTypes.bool,
    warehouseList: PropTypes.array,
    changeStore: PropTypes.func,
    importStockFile: PropTypes.func,
  }

  state = {
    warehouseId: null,
    resetStock: false,
    fileList: [],
  }

  selectWarehouse = (warehouseId) => this.setState({ warehouseId });

  checkReset = (e) => this.setState({ resetStock: e.target.checked });

  hideImportModal = () => this.props.changeStore({ importFileShow: false });

  beforeUploadStation = (file) => {
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validFile = validType.includes(file.type);
    if (validFile) {
      this.setState({ fileList: [file] });
    } else {
      message.error('只支持上传excel文件!');
    }
    return false;
  }

  cancelFile = () => this.setState({ fileList: [] });

  importFile = () => { // 保存上传的附件
    const { warehouseId, resetStock, fileList } = this.state;
    const { importStockFile } = this.props;
    importStockFile({ warehouseId, resetStock, fileList });
  }

  render(){
    const { importFileShow, warehouseList, importLoading } = this.props;
    const { fileList, warehouseId } = this.state;
    const onlyFile = fileList[0] || {};
    return (
      <Modal
        visible={importFileShow}
        title="批量导入库存"
        maskClosable={false}
        onCancel={this.hideImportModal}
        footer={null}
        width={625}
      >
        <div className={styles.importFileModal}>
          <div className={styles.warehouseSelect}>
            <span className={styles.title}>仓库名称</span>
            <Select
              placeholder="请选择"
              onChange={this.selectWarehouse}
              style={{width: 200}}
            >
              {warehouseList.map(e => (
                <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
              ))}
            </Select>
          </div>
          <div className={styles.resetStock}>
            <span className={styles.holder} />
            <Checkbox onChange={this.checkReset}>初始化库存</Checkbox>
          </div>
          <div className={styles.uploader}>
            <div className={styles.title}>附件</div>
            <div>
              {fileList.length === 0 && <span>
                <Upload
                  beforeUpload={this.beforeUploadStation}
                  fileList={fileList}
                  showUploadList={false}
                >
                  <CneButton className={styles.selectFile}>选择文件</CneButton>
                </Upload>
                <span className={styles.text}>支持xls、xlsx文件</span>
              </span>}
              {fileList.length > 0 && <span>
                <span>{onlyFile.name}</span>
                <i onClick={this.cancelFile} className="iconfont icon-del" />
              </span>}
            </div>
          </div>
          <div className={styles.confirmImport}>
            <span className={styles.holder} />
            <CneButton
              className={styles.importFile}
              disabled={!(warehouseId && fileList.length > 0)}
              onClick={this.importFile}
              loading={importLoading}
            >导入</CneButton>
          </div>
        </div>
      </Modal>
    );
  }
}
