import React from 'react';
import styles from './deviceMonitor.scss';

function DevicePointsTable({ devicePointData }) {
  return (
    <div className={styles.devicePointsTable} >
      测点展示表格区
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
