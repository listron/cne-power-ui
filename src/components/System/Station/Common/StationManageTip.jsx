

import React from 'react';
import styles from './common.scss';

function StationManageTip({ hideManageTip, text }){

  return (<div className={styles.stationManageTip}>
    <span className={styles.leftTips} >
      <span className={styles.icon}>i</span>
      <span className={styles.wordTip}>{text}</span>
    </span>
    <span className={styles.close} onClick={hideManageTip}>×</span>
  </div>)
}

export default StationManageTip;