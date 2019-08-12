import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMonitor.scss';

function DevicePointsData({ devicePointData, deviceDetail }) {
  devicePointData = devicePointData.sort((a, b) => (a.devicePointCode.localeCompare(b.devicePointCode)));
  const pointListGroup = [];
  let startIndex = 0;
  do {
    const eachPointGroup = devicePointData.slice(startIndex, startIndex + 10);
    startIndex += 10;
    pointListGroup.push(eachPointGroup);
  } while (startIndex < devicePointData.length);

  return (
    <div className={styles.pointData} >
      <div className={styles.pointTitle}>{deviceDetail.deviceTypeName || ''}实时测点数据</div>
      <div className={styles.pointDataList} >
        {pointListGroup.map((e, i) => (<div className={styles.eachGroup} key={i}>
          {e.map(eachPoints => {
            let pointValue = eachPoints.devicePointValue;
            pointValue = (pointValue || parseFloat(pointValue) === 0) ? pointValue : '--';
            return (<div className={styles.eachData} key={eachPoints.devicePointCode}>
              <p className={styles.pointName}>{eachPoints.devicePointName}</p>
              <p className={styles.pointValue}>{pointValue}{eachPoints.devicePointUnit || ''}</p>
            </div>);
          })}
        </div>))}
      </div>
    </div>
  );
}

DevicePointsData.propTypes = {
  devicePointData: PropTypes.array,
  deviceDetail: PropTypes.object,
};

export default DevicePointsData;
