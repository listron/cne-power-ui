import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { PVStationTypes, deviceStatusArray } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

class IntegrateHeader extends Component {

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
    const { parentDevice, deviceStatus, manufacturer, deviceModelName } = deviceDetail;
    const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    const parentDeviceBaseInfo = PVStationTypes.find(e=>parentDevice && parentDevice.deviceTypeCode === e.deviceTypeCode) || {};
    return (
      <div className={styles.deviceMonitorHeader} style={{
        borderBottom: '1px solid #dfdfdf',
        marginBottom: '20px'
      }}>
        {showDeviceChangeBox && <HeaderDeviceChange
          devices={devices}
          deviceDetail={deviceDetail}
          baseLinkPath={baseLinkPath}
          hideDeviceChange={this.hideDeviceChange}
        />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || '--'}</span>
          <span className={styles.manufactor}>生产厂商：{manufacturer || '--'}</span>
          <span className={styles.deviceModelName}>设备型号：{deviceModelName || '--'}</span>
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
export default IntegrateHeader;