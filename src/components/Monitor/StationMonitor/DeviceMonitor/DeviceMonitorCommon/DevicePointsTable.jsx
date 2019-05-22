import React from 'react';
import styles from './deviceMonitor.scss';

function DevicePointsTable({ devicePointData = [], deviceEvents = [] }) {
  devicePointData = [1,2,3,4,5, 6,6,6,6,6,6,6,6,6,,66,6,6,6,6,6,6].map(e => ({
    devicePointName: '试试看' + Math.random(),
    devicePointValue: e,
    devicePointUnit: 'V',
  }))
  deviceEvents = [1,2,3,4,5, 6,6,6,6,6,6,6,6,6,,66,6,6,6,6,6,6].map(() => ({
    eventsTime: '2014-11-11 10:11',
    eventDescribe: '这就是个事件'
  }))
  return (
    <div className={styles.devicePointsTable} >
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
                <span className={styles.value}>{e.devicePointValue || ''}</span>
                <span className={styles.unit}>{e.devicePointUnit || ''}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.eventsList}>
        <h3>事件</h3>
        <div className={styles.listBox}>
          {deviceEvents.map((e,i) => (
            <div
              key={i}
              className={styles.eachInfo}
              style={{backgroundColor: i % 2 === 0 ? 'transparent' : '#f8f8f8'}}
            >
              <span>{e.eventsTime || '--'}</span>
              <span className={styles.eventDescribe}>{e.eventDescribe || '--'}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className={styles.pointTitle}>{deviceDetail.deviceTypeName || ''}实时测点数据</div>
      <div className={styles.pointDataList} >
        {pointListGroup.map((e, i) => (<div className={styles.eachGroup} key={i}>
          {e.map(eachPoints => {
            let pointValue = eachPoints.devicePointValue;
            pointValue = (pointValue || parseFloat(pointValue) === 0) ? pointValue : '--';
            return (<div className={styles.eachData} key={eachPoints.devicePointCode}>
              <p className={styles.pointName}>{eachPoints.devicePointName}</p>
              <p className={styles.pointValue}>{pointValue}{eachPoints.devicePointUnit || ''}</p>
            </div>)
          })}
        </div>))}
      </div> */}
    </div>

  )
}

export default DevicePointsTable;
