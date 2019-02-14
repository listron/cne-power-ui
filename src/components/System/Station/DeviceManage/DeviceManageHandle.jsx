import React, { Component } from 'react';
import styles from './deviceManage.scss';
import ImportDevice from './ImportDevice';
import CommonPagination from '../../../Common/CommonPagination';
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
      showModal: false
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
  addDevice=()=>{
    this.props.changeDeviceManageStore({showPage:'add'})
  }
  deletDevice = () => {
    alert('shanchu ')
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

  render() {
    const { showModal } = this.state;
    const { totalNum, deviceList, stationCode, pageSize, pageNum } = this.props;
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadDeviceInfo}?stationCode=${stationCode}`;
    const test = `${path.basePaths.originUri}${path.APISubPaths.system.downloadStationTemplet}`;
    return (
      <div className={styles.deviceManageHandle}>
        <div className={styles.left}>
          <Button onClick={this.addDevice} className={styles.plusButton} icon="plus" >设备</Button>
          <Button className={styles.deletStyle} onClick={this.deletDevice} >删除</Button>
          <Button className={styles.downloadStyle} href={test} download={test} target="_blank"  >下载设备信息导入模板</Button>
          <Button className={styles.import} onClick={this.showModal}>导入</Button>
          <Button disabled={deviceList.length === 0} className={styles.exportInfo} href={downloadHref} download={downloadHref} target="_blank"  >导出设备信息表</Button>
        </div>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        {showModal ?<ImportDevice showModal={showModal} cancelModal={this.cancelModal} />  : ''}
      </div>

    );
  }
}

export default DeviceManageHandle;
