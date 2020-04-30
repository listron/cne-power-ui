import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import { PVStationTypes } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import CneButton from '@components/Common/Power/CneButton';

class BoosterHeader extends Component {

  static propTypes = {
    devices: PropTypes.array,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceDetail: PropTypes.object,
    history: PropTypes.object,
    resetDeviceStore: PropTypes.func,
    boosterList: PropTypes.array,
  }

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
  }

  hideDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: false,
    });
  }

  toParentDevice = (url) => {
    const { resetDeviceStore, history } = this.props;
    resetDeviceStore();
    history.push(url);
  }

  render() {
    const { devices, deviceDetail, stationCode, deviceTypeCode, boosterList } = this.props;
    const { showDeviceChangeBox } = this.state;
    const { manufacturer, deviceModeName, deviceCode } = deviceDetail;
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceTypeCode}`;
    const parentDevice = deviceDetail.parentDevice || {};
    const parentDeviceBaseInfo = PVStationTypes.find(e => parentDevice.deviceTypeCode === e.deviceTypeCode) || {};
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange
          devices={devices.map(e => ({
            deviceName: e.deviceTypeName,
            deviceCode: e.deviceTypeCode,
          }))}
          deviceDetail={deviceDetail}
          baseLinkPath={baseLinkPath}
          hideDeviceChange={this.hideDeviceChange}
        />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name}>{deviceDetail.deviceName}</span>
          {/* <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || '--'}</span> */}
          <span className={styles.manufactor}>生产厂商：{manufacturer || '--'}</span>
          <span className={styles.deviceModelName}>设备型号：{deviceModeName || '--'}</span>
          <CneButton className={styles.deviceBtn} lengthMode="long"><Link to={`/operation/book/deviceManage?deviceFullCode=${deviceCode}&showPage='detail'`} target="_blank">
            <i className="iconfont icon-edit" /><i className={styles.text}>修改设备信息</i>
          </Link></CneButton>
        </div>
        <div className={styles.linkTo}>
          {parentDevice && parentDevice.deviceTypeCode && <span
            onClick={() => this.toParentDevice(
              `/hidden/monitorDevice/${stationCode}/${parentDevice.deviceTypeCode}/${parentDevice.deviceCode}`
            )}
            className={styles.eachLink}
          >
            <span className={parentDeviceBaseInfo && `${parentDeviceBaseInfo.icon} linkIcon`}></span>
            <span className={styles.linkName}>
              {parentDevice.deviceTypeName}{parentDevice.deviceName}详情
            </span>
            <span className="iconfont icon-upstream linkIcon"></span>
          </span>}
          <Link to={`/monitor/singleStation/${stationCode}?showPart=301`} className={styles.backIcon}>
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" />
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
    );
  }
}
export default BoosterHeader;
