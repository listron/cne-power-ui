

import React from 'react';
import styles from './deviceManage.scss';

function DeviceManageTip({ hideManageTip }){

  return (<div className={styles.deviceManageTip}>
    <span>
      <span className={styles.icon}>i</span>
      <span className={styles.wordTip}>请选择电站！</span>
    </span>
    <span className={styles.close} onClick={hideManageTip}>×</span>
  </div>)
}

export default DeviceManageTip;