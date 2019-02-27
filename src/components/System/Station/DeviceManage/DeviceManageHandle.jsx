import React, { Component } from 'react';
import styles from './deviceManage.scss';
import ImportDevice from './ImportDevice';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';

class DeviceManageHandle extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    totalNum: PropTypes.number,
    deviceList: PropTypes.array,
    queryParams: PropTypes.object,
    getDeviceList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showDeleteWarning: false,
      warningTipText: '确定要删除选中设备信息?'
    }
  }

  onPaginationChange = ({ pageSize, currentPage }) => {
    const { queryParams, getDeviceList } = this.props;
    getDeviceList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }
  addDevice = () => {
    this.props.changeDeviceManageStore({ showPage: 'add' })
  }
  deletDevice = () => {
    this.setState({ showDeleteWarning: true });
  }
  showModal = () => {
    this.setState({
      showModal: true
    }
    )
  }
  cancelModal = () => {
    this.setState({ showModal: false })
  }
  cancelWarningTip = () => {
    this.setState({ showDeleteWarning: false })
  }
  confirmWarningTip = () => {
    const { selectedRowData, deleteDevice } = this.props;
    const deviceFullcodes = selectedRowData.map((e, i) => {
      return e.deviceFullCode
    })
    deleteDevice({ deviceFullcodes })
    this.setState({ showDeleteWarning: false })
  }
  deleteStationDevice = () => {
    const {stationCode,deleteStationDevice}=this.props;
    deleteStationDevice({
      stationCode,
    })
  }

  render() {
    const { showModal, showDeleteWarning, warningTipText } = this.state;
    const { totalNum, deviceList, stationCode, pageSize, pageNum ,allStationBaseInfo} = this.props;
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadDeviceInfo}?stationCode=${stationCode}`;
    const test = `${path.basePaths.originUri}${path.APISubPaths.system.downloadDeviceTemplet}`;
    return (
      <div className={styles.deviceManageHandle}>
        <div className={styles.left}>
            <Button onClick={this.addDevice} className={styles.plusButton} icon="plus" >设备</Button>
            <Button className={styles.deletStyle} onClick={this.deletDevice} >删除</Button>
            <Button className={styles.downloadStyle} href={test} download={test} target="_blank"  >下载设备信息导入模板</Button>
            <Button className={styles.import} onClick={this.showModal}>导入</Button>
            <Button disabled={deviceList.length === 0} className={styles.exportInfo} href={downloadHref} download={downloadHref} target="_blank"  >导出</Button>
            <Button onClick={this.deleteStationDevice} disabled={!stationCode}>清除设备</Button>
        </div>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        {showModal ? <ImportDevice {...this.props} showModal={showModal} cancelModal={this.cancelModal} allStationBaseInfo={allStationBaseInfo} /> : ''}
        {showDeleteWarning && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
      </div>

    );
  }
}

export default DeviceManageHandle;
