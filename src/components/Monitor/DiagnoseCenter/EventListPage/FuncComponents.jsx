
import React from 'react';
import PropTypes from 'prop-types';
import styles from './eventListPage.scss';

export function WarningTotal({ warningNum }){
  return (
    <div className={styles.warningTotal}>
      <span>图标</span>
      <span className={styles.warningNumBox}>
        <span>0</span>
        <span>告警数</span>
      </span>
    </div>
  );
}

WarningTotal.propTypes = {
  warningNum: PropTypes.number,
};

export function UpdateTime({ currentTime }){
  return (
    <div className={styles.updateTime}>
      <div className={styles.timeText}>
        <span>{currentTime}</span>
        <span className={styles.timeArea}>北京时间</span>
      </div>
      <div className={styles.timeTip}>本次更新时间</div>
    </div>
  );
}

UpdateTime.propTypes = {
  currentTime: PropTypes.string,
};














