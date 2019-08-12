import React from 'react';
import styles from './deviceMonitor.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

function HeaderDeviceChange({ devices, deviceDetail, baseLinkPath, hideDeviceChange }) {
  const currentDeviceName = deviceDetail.deviceName;
  return (
    <div className={styles.deviceChange}>
      <h4 className={styles.deviceTitle}>
        <Icon type="swap" onClick={hideDeviceChange} className={styles.titleIcon} />
        <span>{currentDeviceName}</span>
      </h4>
      <div className={styles.deviceList} onClick={hideDeviceChange}>
        {devices.sort((a, b) => a['deviceName'].localeCompare(b['deviceName'])).map((e, i) => (<Link className={currentDeviceName === e.deviceName ? styles.currentDeviceName : styles.deviceName} to={`${baseLinkPath}/${e.deviceCode}`} key={i} title={e.deviceName}>{e.deviceName}</Link>))}
      </div>
    </div>
  );
}
export default HeaderDeviceChange;
