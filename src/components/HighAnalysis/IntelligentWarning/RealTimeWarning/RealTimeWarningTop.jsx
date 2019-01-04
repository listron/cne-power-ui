import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import { Tooltip } from 'antd';



class RealTimeWarningTop extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  refresh = () => {
    window.location.reload();
  }

  render() {
    const { oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, warningTypeStatus, lastUpdateTime } = this.props;
    let total = oneWarningNum + twoWarningNum + threeWarningNum + fourWarningNum;
    return (
      <div className={styles.realTimeWarningTop}>
        <div className={styles.alarmInfo}>
          <div className={styles.alarmInfoLeft}>
            {warningTypeStatus === 1 && <i className="iconfont icon-alarm"></i>}
            {warningTypeStatus === 2 && <i className="iconfont icon-manual icon-title"></i>}
            {warningTypeStatus === 3 && <i className="iconfont icon-tranlist icon-title"></i>}
            <div className={styles.alarmInfoItem}>
              <span className={styles.alarmNum}>{isNaN(total) ? '- -' : total}</span>
              <span className={styles.alarmText}>{warningTypeStatus === 1 ? "告警数" : warningTypeStatus === 2 ? "手动解除数" : "转工单数"}</span>
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
          {warningTypeStatus === 1 && <div className={styles.alarmInfoRight}>
            <div className={styles.updateTimeContainer}>
              <span className={styles.updateTime}>{lastUpdateTime + '-北京时间'}</span>
              <span className={styles.updateTimeText}>本次数据更新时间</span>
            </div>
            <div className={styles.refreshIcon} onClick={this.refresh}></div>
            <Tooltip placement="topLeft" overlayStyle={{ width: 418, maxWidth: 500, fontSize: '12px' }} title="数据每隔10秒刷新一次，筛选/查询后不再刷新，如需重置，请点此按钮刷新">
              <i className="iconfont icon-help" onClick={this.refresh}></i>
            </Tooltip>
          </div>}
        </div>

      </div>
    )
  }
}
export default (RealTimeWarningTop)