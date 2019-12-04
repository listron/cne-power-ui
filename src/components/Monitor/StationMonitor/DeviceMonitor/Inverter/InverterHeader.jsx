import React, {Component} from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import {interverStatus, PVStationTypes} from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
import PropTypes from 'prop-types';
import {Button, Icon} from 'antd';
import {Link} from 'react-router-dom';

class InverterHeader extends Component {

  static propTypes = {
    devices: PropTypes.array,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceDetail: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    resetDeviceStore: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDeviceChangeBox: false,
    };
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hideDeviceChange, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hideDeviceChange, true);
  }

  showDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: true,
    });
  };

  hideDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: false,
    });
  };

  toParentDevice = (url) => {
    const {resetDeviceStore, history} = this.props;
    resetDeviceStore();
    history.push(url);
  };

  changeDeviceFunc = () => {
    // 获取设备全编码
    const { match: {params: {deviceCode }}, history, changeDeviceManageStore } = this.props;
    history.push(`/operation/book/deviceManage?deviceFullCode=${deviceCode}`);
    setTimeout(() => {
      changeDeviceManageStore({ showPage: 'detail' });
    }, 1000);
  };

  render() {
    const {devices, deviceDetail, stationCode, deviceTypeCode} = this.props;
    const {showDeviceChangeBox} = this.state;
    const {deviceStatus, manufacturer, deviceModeName} = deviceDetail;
    const parentDevice = deviceDetail.parentDevice || {};
    const parentDeviceBaseInfo = PVStationTypes.find(e => parentDevice.deviceTypeCode === e.deviceTypeCode) || {};
    const parentDeviceTypeCode = parentDevice.deviceTypeCode; // 父级设备type
    const parentDeviceCode = parentDevice.deviceCode; //父级设备code
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader}>
        {showDeviceChangeBox &&
        <HeaderDeviceChange devices={devices} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath}
                            hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name} onClick={this.showDeviceChange}>{deviceDetail.deviceName}</span>
          <span className={styles.status}>设备状态: {interverStatus[deviceStatus] || '--'}</span>
          <span className={styles.manufactor}>生产厂商：{manufacturer || '--'}</span>
          <span className={styles.deviceModelName}>设备型号：{deviceModeName || '--'}</span>
          <Button className={styles.deviceBtn} onClick={this.changeDeviceFunc}><i className="iconfont icon-edit"/><i>修改设备信息</i></Button>
        </div>
        <div className={styles.linkTo}>
          {(parentDeviceTypeCode && parentDeviceCode && <span
            onClick={() => this.toParentDevice(
              `/hidden/monitorDevice/${stationCode}/${parentDeviceTypeCode}/${parentDeviceCode}`,
            )}
            className={styles.eachLink}
          >
            <span className={parentDeviceBaseInfo && `${parentDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>
              {parentDevice.deviceTypeName}{parentDevice.deviceName}详情
            </span>
            <span className="iconfont icon-upstream linkIcon"></span>
          </span>)}
          <Link to={`/monitor/singleStation/${stationCode}?showPart=${deviceDetail.deviceTypeCode}`}
                className={styles.backIcon}>
            <Icon type="arrow-left" />
          </Link>
        </div>
      </div>
    );
  }
}

export default InverterHeader;
