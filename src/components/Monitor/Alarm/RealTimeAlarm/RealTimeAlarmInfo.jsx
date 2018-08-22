import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './realTimeAlarm.scss';

class RealTimeAlarmInfo extends Component {
  static propTypes = {
    alarmNum: PropTypes.object,
    alarmStatus: PropTypes.string,
    lastUpdateTime: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const alarmNum = this.props.alarmNum;
    let total = 0;
    if(alarmNum.oneWarningNum) {
      total = alarmNum.oneWarningNum + alarmNum.twoWarningNum + alarmNum.threeWarningNum + alarmNum.fourWarningNum;
    }
    return (
      <div className={styles.alarmInfo}>
        <div className={styles.alarmInfoLeft}>
          <i className="iconfont icon-alarm"></i>
          <div className={styles.alarmInfoItem}>
            <span className={styles.alarmNum}>{total}</span>
            <span className={styles.alarmText}>告警数</span>
          </div>
          <div className={styles.alarmNumDetail}>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.oneWarningNum}</span>
              <span className={styles.alarmText}>一级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.twoWarningNum}</span>
              <span className={styles.alarmText}>二级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.threeWarningNum}</span>
              <span className={styles.alarmText}>三级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.fourWarningNum}</span>
              <span className={styles.alarmText}>四级</span>
            </div>
          </div>
          <div className={styles.alarmAction}>
            <i className="iconfont icon-tranlist icon-action"></i>
            <span className={styles.alarmText}>已转工单</span>
          </div>
          <div className={styles.alarmAction}>
            <i className="iconfont icon-manual icon-action"></i>
            <span className={styles.alarmText}>手动解除</span>
          </div>
        </div>
        <div className={styles.alarmInfoRight}>
          <div className={styles.updateTimeContainer}>
            <span className={styles.updateTime}>{this.props.lastUpdateTime+'-北京时间'}</span>
            <span className={styles.updateTimeText}>本次数据更新时间</span>
          </div>
          <i className="iconfont icon-refresh"></i>
        </div>
      </div>
    );
  }

}

export default RealTimeAlarmInfo;