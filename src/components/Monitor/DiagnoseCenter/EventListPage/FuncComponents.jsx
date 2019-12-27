
import React from 'react';
import PropTypes from 'prop-types';
import styles from './eventListPage.scss';

export function WarningTotal({ warningNum }){
  return (
    <div className={styles.warningTotal}>
      <i className="iconfont icon-alarm" />
      <div className={styles.warningNumBox}>
        <div className={styles.totalValue}>{warningNum}</div>
        <div className={styles.totalText}>告警数</div>
        <div className={styles.triangle} />
      </div>
    </div>
  );
}

WarningTotal.propTypes = {
  warningNum: PropTypes.string,
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














