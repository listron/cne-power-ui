

import React from 'react';
import styles from './deviceManage.scss';

function DeviceManageTip({ hideManageTip }){

  return (<div className={styles.deviceManageTip}>
    <span>
      <span>i</span>
      <span>请选择您要查看的电站</span>
    </span>
    <span onClick={hideManageTip}>x</span>
  </div>)
}

export default DeviceManageTip;