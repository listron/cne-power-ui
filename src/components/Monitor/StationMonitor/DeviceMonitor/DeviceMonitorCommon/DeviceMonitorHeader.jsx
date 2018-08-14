import React, { Component } from 'react';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

class DeviceMonitorHeader extends Component {

  static propTypes = {
    devices: PropTypes.array,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showDeviceChangeBox: false,
    }
  }

  showDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: true,
    })
  }

  hideDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: false,
    })
  }

  render() {
    const { devices, deviceDetail, stationCode, deviceTypeCode } = this.props;
    const { showDeviceChangeBox } = this.state;
    const deviceStatusArray = ['正常', '停机', '故障', '未接入'];
    const { deviceStatus } = deviceDetail;
    const deviceStatusName = deviceStatusArray[deviceStatus / 10 - 1];
    const parentInfor = {
      typeName: deviceDetail.parentDevice?deviceDetail.parentDevice.deviceTypeName: '',
      typeCode: deviceDetail.parentDevice?deviceDetail.parentDevice.deviceTypeCode: '', 
      deviceName: deviceDetail.parentDevice?deviceDetail.parentDevice.deviceName: '',
      deviceCode: deviceDetail.parentDevice?deviceDetail.parentDevice.deviceCode: '',
    };
    const sonInfor = {
      typeName: deviceDetail.sonDevice?deviceDetail.sonDevice.deviceTypeName: '',
      typeCode: deviceDetail.sonDevice?deviceDetail.sonDevice.deviceTypeCode: '', 
      deviceName: deviceDetail.sonDevice?deviceDetail.sonDevice.deviceName: '',
      deviceCode: deviceDetail.sonDevice?deviceDetail.sonDevice.deviceCode: '',
    };
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <div className={styles.deviceChange}>
          <h4 className={styles.deviceTitle}>
            <Icon type="swap" onClick={this.hideDeviceChange} className={styles.titleIcon} />
            <span>{deviceDetail.deviceName}</span>
          </h4>
          <div className={styles.deviceList}>
            {devices.map(e=>(<Link className={styles.eachDevice} to={`/hidden/monitorDevice/${stationCode}/${deviceTypeCode}/${e.deviceCode}`} key={e.deviceCode}>{e.deviceName}</Link>))}
          </div>
        </div>}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >设备状态: { deviceStatusName || ''}</span>
        </div>
        <div className={styles.linkTo}>
          <Link to={`/hidden/singleStation/${stationCode}?showPart=${parentInfor.typeCode}`} className={styles.eachLink}>
            <span className={styles.linkName}>{parentInfor.typeName}{parentInfor.deviceName}</span>
            <Icon type="up" className={styles.linkIcon} />
          </Link>
          <Link to={`/hidden/monitorDevice/${stationCode}/${sonInfor.typeCode}/${sonInfor.deviceCode}`} className={styles.eachLink}>
            <span className={styles.linkName}>{sonInfor.typeName}{sonInfor.deviceName}</span>
            <Icon type="down" className={styles.linkIcon} />
          </Link>
        </div>
      </div>
    )
  }
}
export default DeviceMonitorHeader;