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
    })
  }

  hideDeviceChange = () => {
    this.setState({
      showDeviceChangeBox: false,
    })
  }

  render() {
    const { devices, deviceDetail, stationCode } = this.props;
    const { showDeviceChangeBox } = this.state;
    const baseLinkPath = `/hidden/monitorDevice/${stationCode}/${deviceDetail.deviceTypeCode}`;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices.filter(e=>e!==900)} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name} onClick={this.showDeviceChange}>{deviceDetail.deviceName}</span>
          <span className={styles.status} >
            <span>设备状态:</span>
            {deviceDetail.alarmNum > 0 ?
              <p><span className="iconfont icon-alarm alarm"></span>告警</p> :
              <p><span className="iconfont icon-examine"></span> 正常 </p>
            }
          </span>
        </div>
      </div>
    )
  }
}
export default InverterHeader;