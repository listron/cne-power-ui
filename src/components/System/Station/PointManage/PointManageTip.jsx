

import React from 'react';
import styles from './pointManage.scss';

function PointManageTip({ hideManageTip }){

  return (<div className={styles.deviceManageTip}>
    <span>
      <span>i</span>
      <span>请选择电站!</span>
    </span>
    <span onClick={hideManageTip}>x</span>
  </div>)
}

export default PointManageTip;