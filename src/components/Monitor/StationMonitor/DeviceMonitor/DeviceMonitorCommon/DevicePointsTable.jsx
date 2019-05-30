import React from 'react';
// import { dataFormat } from '../../../../../utils/utilFunc';
import moment from 'moment';
import styles from './deviceMonitor.scss';

const DevicePointsTable = ({ devicePointData = [], deviceEvents = [] }) => (
  <div className={styles.devicePointsTable}>
    <div className={styles.pointsList}>
      <h3>实时测点数据</h3>
      <div className={styles.listBox}>
        {devicePointData.map((e,i) => (
          <div
            key={e.devicePointName}
            className={styles.eachInfo}
            style={{backgroundColor: i % 2 === 0 ? 'transparent' : '#f8f8f8'}}
          >
            <span>{e.devicePointName || ''}</span>
            <span className={styles.pointValue}>
              <span className={styles.value}>{e.devicePointValue || '--'}</span>
              <span className={styles.unit}>{e.devicePointUnit || ''}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className={styles.eventsList}>
      <h3>事件</h3>
      <div className={styles.listBox}>
        {deviceEvents && deviceEvents.length > 0 ? deviceEvents.map((e,i) => (
          <div
            key={i}
            className={styles.eachInfo}
            style={{backgroundColor: i % 2 === 0 ? 'transparent' : '#f8f8f8'}}
          >
            <span>{e.eventTime ? moment(e.eventTime).format('YYYY-MM-DD HH:mm') : '--'}</span>
            <span className={styles.eventDescribe}>{e.eventDesc || '--'}</span>
          </div>
        )): <span className={styles.noEvents}>暂无数据</span>}
      </div>
    </div>
  </div>
)

export default DevicePointsTable;
