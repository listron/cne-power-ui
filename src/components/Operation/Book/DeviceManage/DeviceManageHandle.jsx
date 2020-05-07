import React, { Component } from 'react';
import styles from './deviceManage.scss';
import ImportDevice from './ImportDevice';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import PropTypes from 'prop-types';
import { handleRight } from '@utils/utilFunc';
import path from '../../../../constants/path';
import CneButton from '@components/Common/Power/CneButton';

class DeviceManageHandle extends Component {
  static propTypes = {
    exportLoading: PropTypes.bool,
    importLoading: PropTypes.bool,
    stationCode: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    totalNum: PropTypes.number,
    deviceList: PropTypes.array,
    queryParams: PropTypes.object,
    getDeviceList: PropTypes.func,
    exportPoints: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showDeleteWarning: false,
      warningTipText: '确定要删除选中设备信息?',
      showDeleteDevice: false,
      deleteType: '',
    };
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { queryParams, getDeviceList } = this.props;
    getDeviceList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    });
  }
  addDevice = () => {
    this.props.changeDeviceManageStore({ showPage: 'add' });
  }
  deletDevice = () => {
    this.setState({
      deleteType: 'deviceInfo',
      showDeleteWarning: true,
      warningTipText: '确定要删除选中设备信息?',
    });
  }
  showModal = () => {
    this.setState({
      showModal: true,
    }
    );
  }
  cancelModal = () => {
    this.setState({ showModal: false });
  }
  cancelWarningTip = () => {
    this.setState({ showDeleteWarning: false, showDeleteDevice: false });
  }
  confirmWarningTip = () => {
    const { deleteType } = this.state;
    const { selectedRowData, deleteDevice, stationCode, deleteStationDevice } = this.props;
    const deviceFullcodes = selectedRowData.map((e, i) => {
      return e.deviceFullCode;
    });
    if (deleteType === 'deviceInfo') {
      deleteDevice({ deviceFullcodes: deviceFullcodes });
    } else {
      deleteStationDevice({
        stationCode,
      });
    }

    this.setState({ showDeleteWarning: false, showDeleteDevice: false });
  }
  deleteStationDevice = () => {
    const { stationCode, deleteStationDevice } = this.props;
    this.setState({
      deleteType: 'stationDevice',
      showDeleteDevice: true,
      warningTipText: '确定要删除设备?',

    });
    // deleteStationDevice({
    //   stationCode,
    // });
  }

  toExport = () => {
    const { exportPoints, stationCode } = this.props;
    exportPoints({
      url: `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadDeviceInfo}?stationCode=${stationCode}`,
      method: 'get',
      loadingName: 'exportLoading',
      fileName: '电站设备表.xlsx',
    });
  }

  render() {
    const { showModal, showDeleteWarning, warningTipText, showDeleteDevice } = this.state;
    const { totalNum, deviceList, stationCode, pageSize, pageNum, allStationBaseInfo, selectedRowKeys, exportLoading } = this.props;
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.system.downloadDeviceTemplet}`;
    const deviceHandleRight = handleRight('book_operateDevice');
    return (
      <div className={styles.deviceManageHandle}>
        {deviceHandleRight ? <div className={styles.left}>
          <CneButton lengthMode="short" className={styles.plusButton} onClick={this.addDevice}>
            <div className={styles.icon}>
                <span className={'iconfont icon-newbuilt'} />
            </div> 设备
          </CneButton>
          <CneButton lengthMode="short" className={styles.deletStyle} onClick={this.deletDevice} disabled={selectedRowKeys.length === 0} >删除</CneButton>
          <CneButton className={styles.downloadStyle} href={downloadTemplet} download={downloadTemplet} target="_blank" >下载设备信息导入模板</CneButton>
          <CneButton lengthMode="short" className={styles.import} onClick={this.showModal} loading={this.props.importLoading} >导入</CneButton>
          <CneButton
            lengthMode="short"
            disabled={deviceList.length === 0}
            className={styles.exportInfo}
            onClick={this.toExport}
            loading={exportLoading}
          >导出</CneButton>
          <CneButton lengthMode="short" onClick={this.deleteStationDevice} className={styles.exportInfo} disabled={!stationCode}>清除设备</CneButton>
        </div> : <div />}
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        {showModal ? <ImportDevice {...this.props} showModal={showModal} cancelModal={this.cancelModal} allStationBaseInfo={allStationBaseInfo} /> : ''}
        {(showDeleteWarning || showDeleteDevice) && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
      </div>
    );
  }
}

export default DeviceManageHandle;
