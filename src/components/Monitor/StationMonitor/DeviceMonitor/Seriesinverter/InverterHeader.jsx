import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { deviceStatusArray, PVStationTypes } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
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
    const { deviceStatus, parentDevice } = deviceDetail;
    const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
    const parentDeviceBaseInfo = PVStationTypes.find(e=>parentDevice && parentDevice.deviceTypeCode === e.deviceTypeCode);
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >
            <span>设备状态:</span> 
            <span className={deviceStatusInfo && `${deviceStatusInfo.icon} statusIcon` || ''}></span>
            <span>{ deviceStatusInfo && deviceStatusInfo.statusName || ' '}</span>
          </span>
        </div>
        <div className={styles.linkTo}>
          <Link to={`/hidden/monitorDevice/${stationCode}/${parentDevice && parentDevice.deviceTypeCode}/${parentDevice && parentDevice.deviceCode}`} className={styles.eachLink}>
            <span className={parentDeviceBaseInfo && `${parentDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>
              {parentDevice && parentDevice.deviceTypeName}{parentDevice && parentDevice.deviceName}详情
            </span>
            <span className="iconfont icon-upstream linkIcon"></span>
          </Link>
          <Link to={`/monitor/singleStation/${stationCode}?showPart=509`} className={styles.eachLink}>
            <span className="iconfont icon-pvs linkIcon"></span>
            <span className={styles.linkName}>光伏组串列表</span>
            <span className="iconfont icon-downstream linkIcon"></span>
          </Link>
        </div>
      </div>
    )
  }
}
export default InverterHeader;