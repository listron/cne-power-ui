

import React from 'react';
import styles from './common.scss';

function StationManageTip({ hideManageTip }){

  return (<div className={styles.stationManageTip}>
    <span>
      <span className={styles.icon}>i</span>
      <span className={styles.wordTip}>请选择电站！</span>
    </span>
    <span className={styles.close} onClick={hideManageTip}>×</span>
  </div>)
}

export default StationManageTip;