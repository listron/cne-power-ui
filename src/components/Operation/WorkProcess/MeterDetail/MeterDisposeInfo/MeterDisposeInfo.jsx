import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './meterDisposeInfo.scss';

export default class MeterDisposeInfo extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
  };
  render() {
    // 没有电表数据
    const noDataRender = (
      <div className={styles.disposeNoDataBox}>
        <div className={styles.noDataIcon}>
          <i className="iconfont icon-biao" />
        </div>
        <div className={styles.noDataText}>
          还没有电表，请先配置电表。
        </div>
        <div className={styles.noDataRouter}>
          <span>点击前往：运维管理-电站运行-</span>
          <Link to="/" className={styles.meterRouter}>抄表</Link>
        </div>
      </div>
    );
    return (
      <div className={styles.meterDisposeInfo} >
        <div className={styles.disposeBanner}>
          处理信息
        </div>
        <div className={styles.disposeContent}>
          <div className={styles.disposeNav}>
            <div className={styles.navPrev}>
              <div className={styles.navPrevName}>
                上次抄表日期
              </div>
              <div className={styles.navPrevTime}>
                2019-10-15
              </div>
            </div>
            <div className={styles.navTime}>
              <div>
                结算月份
              </div>
              <div>
                2019年10月
              </div>
            </div>
            <div className={styles.navNow}>
              <div className={styles.navNowName}>
                本次抄表日期
              </div>
              <div className={styles.navNowTime}>
                2019-10-15
              </div>
            </div>
          </div>
          {noDataRender}
        </div>
      </div>
    );
  }
}
