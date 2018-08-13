import React from 'react';
import styles from './deviceMonitor.scss';

function DevicePointsData({ devicePointData, deviceDetail }) {

  let pointListGroup = [],startIndex = 0;
  do{
    let eachPointGroup = devicePointData.slice(startIndex, startIndex + 10);
    startIndex += 10;
    pointListGroup.push(eachPointGroup);
  }while(startIndex < devicePointData.length);

  return (
    <div className={styles.pointData} >
      <div className={styles.pointTitle}>{deviceDetail.deviceTypeName || ''}实时测点数据</div>
      <div className={styles.pointDataList} >
        {pointListGroup.map((e, i)=>(<div className={styles.eachGroup} key={i}>
          {e.map(eachPoints => (<div key={eachPoints.devicePointCode}>
            <span>{eachPoints.devicePointName}</span>
            <span>{eachPoints.devicePointValue} {eachPoints.devicePointUnit || ''}</span>
          </div>))}
        </div>))}
      </div>
    </div>
    
  )
}

export default DevicePointsData;
