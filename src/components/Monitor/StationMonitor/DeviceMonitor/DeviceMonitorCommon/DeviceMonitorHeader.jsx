import React, { Component } from 'react';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class DeviceMonitorHeader extends Component {

  static propTypes = {
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { devices, deviceDetail } = this.props;
    return (
      <div className={styles.alarmTable} >
        <div>{deviceDetail.deviceName}</div>
        <div>{deviceDetail.parentDevice && deviceDetail.parentDevice.deviceName}</div>
        <div>{deviceDetail.sonDevice && deviceDetail.sonDevice.deviceName}</div>
      </div>
    )
  }
  
}

export default DeviceMonitorHeader;