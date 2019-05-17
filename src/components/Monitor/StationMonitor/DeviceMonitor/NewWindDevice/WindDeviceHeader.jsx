import React, { Component } from 'react';
import HeaderDeviceChange from '../DeviceMonitorCommon/HeaderDeviceChange';
import styles from './windDevice.scss';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

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

  getStatusName = (status) => {
    let result = {};
    switch (status) {
      case 400: result = { text: '运行', name: 'normalNum', icon: 'icon-examine' }; break;
      case 700: result = { text: '待机', name: 'standbyNum', icon: 'icon-await' }; break;
      case 200: result = { text: '停机', name: 'shutdownNum', icon: 'icon-suspend' }; break;
      case 600: result = { text: '维护', name: 'maintainNum', icon: 'icon-repair' }; break;
      case 300: result = { text: '故障', name: 'errorNum', icon: 'icon-alarm' }; break;
      case 500: result = { text: '通讯中断', name: 'interruptNum', icon: 'icon-outage' }; break;
      case 900: result = { text: '未接入', name: 'noAccessNum', icon: '' }; break;
    }
    return result;
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
    const deviceStatus=deviceDetail.deviceStatus;
    return (
      <div className={styles.deviceMonitorHeader} >
        {showDeviceChangeBox && <HeaderDeviceChange devices={devices.filter(e => e !== 900)} deviceDetail={deviceDetail} baseLinkPath={baseLinkPath} hideDeviceChange={this.hideDeviceChange} />}
        <div className={styles.deviceName}>
          <Icon type="swap" className={styles.swap} onClick={this.showDeviceChange} />
          <span className={styles.name} onClick={this.showDeviceChange}>{deviceDetail.deviceName}</span>
          <div className={styles.status} >
            <span>设备状态 : </span>
            {<div className={styles[this.getStatusName(+deviceStatus).name]}>
              <span className={`${'iconfont'} ${this.getStatusName(+deviceStatus).icon}`}></span> {this.getStatusName(+deviceStatus).text}
            </div>}
          </div>
          <div className={styles.parentsName}>
              所属线路 : {deviceDetail.lineName || '--'}
          </div>
        </div>
      </div>
    )
  }
}
export default InverterHeader;