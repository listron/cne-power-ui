import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { deviceStatusArray } from '../../../../../constants/stationBaseInfo';
import styles from './seriesinverter.scss';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

class InverterHeader extends Component {

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
    const { deviceStatus, parentDevice, sonDevice } = deviceDetail;
    const deviceStatusInfo = deviceStatusArray.find(e=>e.statusCode === deviceStatus)
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || ''}</span>
        </div>
        <div className={styles.linkTo}>
          <Link to={`/hidden/monitorDevice/${stationCode}/${parentDevice && parentDevice.deviceTypeCode}/${parentDevice && parentDevice.deviceCode}`} className={styles.eachLink}>
            <span>汇流箱图标</span>
            <span className={styles.linkName}>汇流箱{parentDevice && parentDevice.deviceName}详情</span>
            <Icon type="up" className={styles.linkIcon} />
          </Link>
          <Link to={`/hidden/singleStation/${stationCode}?showPart=${sonDevice && sonDevice.deviceTypeCode}`} className={styles.eachLink}>
            <span>组串图标</span>
            <span className={styles.linkName}>组串列表</span>
            <Icon type="down" className={styles.linkIcon} />
          </Link>
        </div>
      </div>
    )
  }
}
export default InverterHeader;