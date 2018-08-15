import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { deviceStatusArray } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

class ConfluenceHeader extends Component {

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
    const { deviceStatus, parentDevice, sonDevice, dispersionRatio } = deviceDetail;
    const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || ''}</span>
          <span className={styles.dispersionRatio}>离散率>{dispersionRatio}%</span>
        </div>
        <div className={styles.linkTo}>
          <Link to={`/hidden/monitorDevice/${stationCode}/${parentDevice && parentDevice.deviceTypeCode}/${parentDevice && parentDevice.deviceCode}`} className={styles.eachLink}>
            <span>箱式变压器图标</span>
            <span className={styles.linkName}>箱式变压器{parentDevice && parentDevice.deviceName}详情</span>
            <Icon type="up" className={styles.linkIcon} />
          </Link>
          <Link to={`/hidden/singleStation/${stationCode}?showPart=${sonDevice && sonDevice.deviceTypeCode}`} className={styles.eachLink}>
            <span>组串图标</span>
            <span className={styles.linkName}>逆变器列表</span>
            <Icon type="down" className={styles.linkIcon} />
          </Link>
        </div>
      </div>
    )
  }
}
export default ConfluenceHeader;