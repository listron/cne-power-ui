import React from 'react';
import styles from './deviceMonitor.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

function HeaderDeviceChange({ devices, deviceDetail, baseLinkPath, hideDeviceChange }){

  return (
    <div className={styles.deviceChange}>
      <h4 className={styles.deviceTitle}>
        <Icon type="swap" onClick={hideDeviceChange} className={styles.titleIcon} />
        <span>{deviceDetail.deviceName}</span>
      </h4>
      <div className={styles.deviceList} onClick={hideDeviceChange}>
        {devices.map(e=>(<Link className={styles.eachDevice} to={`${baseLinkPath}/${e.deviceCode}`} key={e.deviceCode}>{e.deviceName}</Link>))}
      </div>
    </div>
  )
}
export default HeaderDeviceChange;