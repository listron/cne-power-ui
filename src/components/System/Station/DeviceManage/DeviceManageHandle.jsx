import React, { Component } from 'react';
import styles from './deviceManage.scss';
import CommonPagination from '../../../Common/CommonPagination';
import { Button } from 'antd';
import PropTypes from 'prop-types';

class DeviceManageHandle extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    deviceList: PropTypes.array,
    queryParams: PropTypes.object,
    getDeviceList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  onPaginationChange = ({pageSize, currentPage}) => {
    const { queryParams, getDeviceList } = this.props;
    getDeviceList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  render() {
    const { totalNum, deviceList } = this.props;
    return (
      <div className={styles.deviceManageHandle}>
        <Button disabled={deviceList.length === 0} className={styles.exportInfo}>导出设备信息表</Button>
        <CommonPagination  total={totalNum} onPaginationChange={this.onPaginationChange} />
      </div>
    );
  }
}

export default DeviceManageHandle;
