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
    const { deviceStatus, parentDevice, dispersionRatio, manufactor, deviceModelName } = deviceDetail;
    const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
    const parentDeviceBaseInfo = PVStationTypes.find(e=>parentDevice && parentDevice.deviceTypeCode === e.deviceTypeCode);
    const parentDeviceTypeCode = parentDevice && parentDevice.deviceTypeCode; // 父级设备type
    const parentDeviceCode = parentDevice && parentDevice.deviceCode; //父级设备code
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name} onClick={this.showDeviceChange}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >
            <span>设备状态:</span> 
            <span className={deviceStatusInfo && `${deviceStatusInfo.icon} statusIcon` || ''}></span>
            <span>{ deviceStatusInfo && deviceStatusInfo.statusName || ' '}</span>
          </span>
          <span className={styles.dispersionRatio}>离散率>{dispersionRatio || '--'}</span>
          <span className={styles.manufactor}>生产厂商：{manufactor || '--'}</span>
          <span className={styles.deviceModelName}>设备型号：{deviceModelName || '--'}</span>
        </div>
        <div className={styles.linkTo}>
          {(parentDeviceTypeCode && parentDeviceCode && <Link to={`/hidden/monitorDevice/${stationCode}/${parentDeviceTypeCode}/${parentDeviceCode}`} className={styles.eachLink}>
            <span className={parentDeviceBaseInfo && `${parentDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>
              {parentDevice && parentDevice.deviceTypeName}{parentDevice && parentDevice.deviceName}详情
            </span>
            <span className="iconfont icon-upstream linkIcon"></span>
          </Link>)}
          <Link to={`/monitor/singleStation/${stationCode}?showPart=${deviceDetail.deviceTypeCode}`} className={styles.backIcon}>
            <Icon type="arrow-left" />
          </Link>
          {/* {sonDevice && sonDevice.deviceTypeCode && <Link  to={`/monitor/singleStation/${stationCode}?showPart=${sonDevice.deviceTypeCode}`} className={styles.eachLink}>
            <span className={sonDeviceBaseInfo && `${sonDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>{`${sonDevice?sonDevice.deviceTypeName:''}`}列表</span>
            <span className="iconfont icon-downstream linkIcon"></span>
          </Link>} */}
        </div>
      </div>
    )
  }
}
export default InverterHeader;