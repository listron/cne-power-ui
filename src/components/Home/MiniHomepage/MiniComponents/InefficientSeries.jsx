import React from 'react';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../utils/utilFunc';
import styles from './miniComponents.scss';

export const InefficientSeries = ({ inefficientList = [] }) => {
  const hasInefficient = inefficientList.length > 0 ? true : false;
  return (
    <section className={styles.inefficientSeries}>
      <h3>低效组串预警</h3>
      <div className={styles.table}>
        <div className={styles.inefficientText}>
          <span className={styles.name}>电站名称</span>
          <span className={styles.series}>电流偏低支路</span>
          <span className={styles.lost}>电量损失比(%)</span>
        </div>
        <div className={styles.inefficientList}>
          {false ? inefficientList.slice(0, 3).map(e => (
            <div key={e.inefficiencyId} className={styles.eachInefficient}>
              <span className={styles.name}>{e.stationName}</span>
              <span className={styles.series}>{e.deviceName}</span>
              <span className={styles.lost}>{dataFormat(e.lostGenPercent)}</span>
            </div>
          )) : <div className={styles.noData}>
              <img src="/img/no data_icon.png" />
              <span className={styles.noneText}>暂无预警</span>
          </div>}
        </div>
      </div>
    </section>
  );
};

InefficientSeries.propTypes = {
  inefficientList: PropTypes.array,
};
