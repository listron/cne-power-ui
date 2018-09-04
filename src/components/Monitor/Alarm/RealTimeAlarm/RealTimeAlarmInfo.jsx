import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './realTimeAlarm.scss';
import { Tooltip } from 'antd';

class RealTimeAlarmInfo extends Component {
  static propTypes = {
    alarmNum: PropTypes.object,
    alarmStatus: PropTypes.number,
    lastUpdateTime: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  refresh = () => {
    window.location.reload();
  }

  render() {
    const { alarmNum, alarmStatus, lastUpdateTime} = this.props;
    let total = '- -';
    if(alarmNum && alarmNum.oneWarningNum && alarmNum.oneWarningNum !== null) {
      total = alarmNum.oneWarningNum + alarmNum.twoWarningNum + alarmNum.threeWarningNum + alarmNum.fourWarningNum;
    }
    return (
      <div className={styles.alarmInfo}>
        <div className={styles.alarmInfoLeft}>
          {alarmStatus===1&&<i className="iconfont icon-alarm"></i>}
          {alarmStatus===2&&<i className="iconfont icon-manual icon-title"></i>}
          {alarmStatus===3&&<i className="iconfont icon-tranlist icon-title"></i>}
          <div className={styles.alarmInfoItem}>
            <span className={styles.alarmNum}>{total}</span>
            <span className={styles.alarmText}>{alarmStatus===1?"告警数":alarmStatus===2?"手动解除数":"转工单数"}</span>
          </div>
          <div className={styles.alarmNumDetail}>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.oneWarningNum!==null?alarmNum.oneWarningNum:'- -'}</span>
              <span className={styles.alarmText}>一级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.twoWarningNum!==null?alarmNum.twoWarningNum:'- -'}</span>
              <span className={styles.alarmText}>二级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.threeWarningNum!==null?alarmNum.threeWarningNum:'- -'}</span>
              <span className={styles.alarmText}>三级</span>
            </div>
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{alarmNum.fourWarningNum!==null?alarmNum.fourWarningNum:'- -'}</span>
              <span className={styles.alarmText}>四级</span>
            </div>
          </div>
          {/* {alarmStatus !== 3 && 
            <Link to="/monitor/alarm/realtime/transfer" target="_blank">
              <div className={styles.alarmAction}>
                <i className="iconfont icon-tranlist icon-action"></i>
                <span className={styles.alarmText}>已转工单</span>
              </div>
            </Link>
          }
          {alarmStatus !== 2 && 
            <Link to="/monitor/alarm/realtime/relieve" target="_blank" >
              <div className={styles.alarmAction}>
                <i className="iconfont icon-manual icon-action"></i>
                <span className={styles.alarmText}>手动解除</span>
              </div>
            </Link>
          } */}
        </div>
        {alarmStatus===1&&<div className={styles.alarmInfoRight}>
          <div className={styles.updateTimeContainer}>
            <span className={styles.updateTime}>{lastUpdateTime+'-北京时间'}</span>
            <span className={styles.updateTimeText}>本次数据更新时间</span>
          </div>
          <i className="iconfont icon-refresh" onClick={this.refresh}></i>
          <Tooltip placement="topLeft" overlayClassName="alarmTootip" title="数据每隔10秒刷新一次，筛选/查询后不再刷新，如需重置，请点此按钮刷新">
            <i className="iconfont icon-help" onClick={this.refresh}></i>
          </Tooltip>  
        </div>}
      </div>
    );
  }

}

export default RealTimeAlarmInfo;