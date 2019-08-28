import React, { Component } from 'react';
import styles from './warningStatisticTop.scss';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';

class RealTimeWarningTop extends Component {
  static propTypes = {
    oneWarningNum: PropTypes.any,
    twoWarningNum: PropTypes.any,
    threeWarningNum: PropTypes.any,
    fourWarningNum: PropTypes.any,
    warningStatus: PropTypes.string,
    lastUpdateTime: PropTypes.string,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  refresh = () => {
    window.location.reload();
  }

  render() {
    const { oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, warningStatus, lastUpdateTime, theme } = this.props;
    const total = oneWarningNum + twoWarningNum + threeWarningNum + fourWarningNum;
    return (
      <div className={`${styles.realTimeWarningTop} ${styles[theme]}`}>
        <div className={styles.alarmInfo}>
          <div className={styles.alarmInfoLeft}>
            {warningStatus === '1' && <i className="iconfont icon-alarm"></i>}
            {warningStatus === '2' && <i className="iconfont icon-manual icon-title"></i>}
            {warningStatus === '3' && <i className="iconfont icon-tranlist icon-title"></i>}
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{isNaN(total) ? '- -' : total}</span>
              <span className={styles.alarmText}>{warningStatus === '1' ? '预警数' : warningStatus === '2' ? '手动解除数' : '转工单数'}</span>
            </div>
            <div className={styles.alarmNumDetail}>
              <div className={styles.alarmInfoItem}>
                <span className={styles.alarmNum}>{!isNaN(oneWarningNum) ? oneWarningNum : '- -'}</span>
                <span className={styles.alarmText}>一级</span>
              </div>
              <div className={styles.alarmInfoItem}>
                <span className={styles.alarmNum}>{!isNaN(twoWarningNum) ? twoWarningNum : '- -'}</span>
                <span className={styles.alarmText}>二级</span>
              </div>
              <div className={styles.alarmInfoItem}>
                <span className={styles.alarmNum}>{!isNaN(threeWarningNum) ? threeWarningNum : '- -'}</span>
                <span className={styles.alarmText}>三级</span>
              </div>
              <div className={styles.alarmInfoItem}>
                <span className={styles.alarmNum}>{!isNaN(fourWarningNum) ? fourWarningNum : '- -'}</span>
                <span className={styles.alarmText}>四级</span>
              </div>
            </div>

          </div>
          {warningStatus === '1' && <div className={styles.alarmInfoRight}>
            <div className={styles.updateTimeContainer}>
              <span className={styles.updateTime}>{lastUpdateTime + '-北京时间'}</span>
              <span className={styles.updateTimeText}>本次数据更新时间</span>
            </div>
            <Tooltip placement="topLeft" overlayStyle={{ width: 418, maxWidth: 500, fontSize: '12px' }} title="数据每隔10秒刷新一次，筛选/查询后不再刷新，如需重置，请点此按钮刷新">
              <div className={styles.refreshIcon} onClick={this.refresh}>
                <i className="iconfont icon-refresh" />
                <i className="iconfont icon-help" />
              </div>
            </Tooltip>
          </div>}
        </div>

      </div>
    );
  }
}
export default (RealTimeWarningTop)
  ;
