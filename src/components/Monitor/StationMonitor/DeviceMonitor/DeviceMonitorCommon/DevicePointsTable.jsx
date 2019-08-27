import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { dataFormat } from '../../../../../utils/utilFunc';
import moment from 'moment';
import styles from './deviceMonitor.scss';

class PointsData extends Component {

  static propTypes = {
    devicePointData: PropTypes.array,
  }

  shouldComponentUpdate(nextprops) {
    const nextPointsData = nextprops.devicePointData;
    const { devicePointData } = this.props;
    if (devicePointData.length !== nextPointsData.length) {
      return true;
    }
    return false;
  }

  render() {
    const { devicePointData } = this.props;
    return (
      <div className={`${styles.listBox}`}>
        {devicePointData.map((e, i) => (
          <div
            key={e.devicePointName}
            className={styles.eachInfo}
          >
            <span>{e.devicePointName || ''}</span>
            <span className={styles.pointValue}>
              <span className={styles.value}>{e.devicePointValue || '--'}</span>
              <span className={styles.unit}>{e.devicePointUnit || ''}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

class EventsData extends Component {

  static propTypes = {
    deviceEvents: PropTypes.array,
  }

  shouldComponentUpdate(nextprops) {
    const nextEventsData = nextprops.deviceEvents;
    const { deviceEvents } = this.props;
    if (deviceEvents.length !== nextEventsData.length) {
      return true;
    }
    return false;
  }

  render() {
    const { deviceEvents } = this.props;
    return (
      <div className={styles.listBox}>
        {deviceEvents && deviceEvents.length > 0 ? deviceEvents.map((e, i) => (
          <div
            key={i}
            className={styles.eachInfo}
          >
            <span>{e.eventTime ? moment(e.eventTime).format('YYYY-MM-DD HH:mm') : '--'}</span>
            <span className={styles.eventDescribe}>{e.eventDesc || '--'}</span>
          </div>
        )) : <span className={styles.noEvents}>暂无数据</span>}
      </div>
    );
  }
}

export default function DevicePointsTable({ devicePointData, deviceEvents, theme }) {

  return (
    <div className={`${styles.devicePointsTable} ${styles[theme]}`}>
      <div className={styles.pointsList}>
        <h3>实时测点数据</h3>
        <PointsData devicePointData={devicePointData} />
      </div>
      <div className={styles.eventsList}>
        <h3>事件</h3>
        <EventsData deviceEvents={deviceEvents} />
      </div>
    </div>
  );
}

DevicePointsTable.propTypes = {
  devicePointData: PropTypes.array,
  deviceEvents: PropTypes.array,
  theme: PropTypes.string,
};
