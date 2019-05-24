import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { PVStationTypes } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

class BoosterHeader extends Component {

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

  componentDidMount(){
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hideDeviceChange,true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hideDeviceChange,true);
  }

  showDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: true,
    });
  }

  hideDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: false,
    });
  }

  render() {
    const { devices, deviceDetail, stationCode, deviceTypeCode } = this.props;
    const { showDeviceChangeBox } = this.state;
    const { sonDevice, parentDevice } = deviceDetail;
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    // const sonDeviceBaseInfo = PVStationTypes.find(e => sonDevice && sonDevice.deviceTypeCode === e.deviceTypeCode) || {};
    const parentDeviceBaseInfo = PVStationTypes.find(e => parentDevice && parentDevice.deviceTypeCode === e.deviceTypeCode) || {};
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange
          devices={devices.map(e => ({
            deviceName: e.deviceTypeName,
            deviceCode: e.deviceTypeCode
          }))}
          deviceDetail={deviceDetail}
          baseLinkPath={baseLinkPath}
          hideDeviceChange={this.hideDeviceChange}
        />}
        <div className={styles.deviceName} onClick={this.showDeviceChange}>
          <Icon type="swap" className={styles.swap} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
        </div>
        <div className={styles.linkTo}>
          {parentDevice && parentDevice.deviceTypeCode && <Link
            to={`/hidden/monitorDevice/${stationCode}/${parentDevice.deviceTypeCode}/${parentDevice.deviceCode}`}
            className={styles.eachLink}
          >
            <span className={parentDeviceBaseInfo && `${parentDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>
              {parentDevice.deviceTypeName}{parentDevice.deviceName}详情
            </span>
            <span className="iconfont icon-upstream linkIcon"></span>
          </Link>}
          <Link to={`/monitor/singleStation/${stationCode}?showPart=${deviceDetail.deviceTypeCode}`} className={styles.backIcon}>
            <Icon type="arrow-left" />
          </Link>
          {/* {sonDevice && sonDevice.deviceTypeCode && <Link
            to={`/monitor/singleStation/${stationCode}?showPart=${sonDevice.deviceTypeCode}`}
            className={styles.eachLink}
          >
            <span className={`${sonDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>{sonDevice.deviceTypeName}列表</span>
            <span className="iconfont icon-downstream linkIcon"></span>
          </Link>} */}
        </div>
      </div>
    )
  }
}
export default BoosterHeader;