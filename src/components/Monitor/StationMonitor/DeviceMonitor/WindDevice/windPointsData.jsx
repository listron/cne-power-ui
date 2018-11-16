import React from 'react';
import styles from '../DeviceMonitorCommon/deviceMonitor.scss';

function DevicePointsData({ devicePointData, deviceDetail }) {
  devicePointData = devicePointData.sort((a, b) => (a.devicePointCode.localeCompare(b.devicePointCode)))
  // let devicePointIECGroup = [...new Set(devicePointData.map(e => e.devicePointIECGroup))]
  // let ponitGroup = devicePointIECGroup.map(e => {
  //   return devicePointData.filter((item, index) => {
  //     if (item.devicePointIECGroup === e) {
  //       return item
  //     }
  //   })
  // })
  // console.log('ponitGroup', ponitGroup)
  // let pointListGroups =ponitGroup.map((item, index) => {
  //     let pointListGroup = [], startIndex = 0;
  //     do {
  //       let eachPointGroup = item.slice(startIndex, startIndex + 10);
  //       startIndex += 10;
  //       pointListGroup.push(eachPointGroup);
  //     } while (startIndex < item.length);
  //     return pointListGroup
  //   })

  // console.log('pointListGroups', pointListGroups)


  let pointListGroup = [], startIndex = 0;
  do {
    let eachPointGroup = devicePointData.slice(startIndex, startIndex + 10);
    startIndex += 10;
    pointListGroup.push(eachPointGroup);
  } while (startIndex < devicePointData.length);




  return (
    <div className={styles.pointData} >
      <div className={styles.pointTitle}>{deviceDetail.deviceTypeName || ''}实时测点数据</div>
      <div className={styles.pointDataList} >
        {/* {pointListGroups.length > 0 && pointListGroups.map((item, key) => {
          // console.log('item',item)
          return item.map((e, i) => {
            (<div className={styles.eachGroup} key={i}>
              {e.map(eachPoints => {
                let pointValue = eachPoints.devicePointValue;
                pointValue = (pointValue || parseFloat(pointValue) === 0) ? pointValue : '--';
                return (
                  <div className={styles.eachData} key={eachPoints.devicePointCode}>
                    <p className={styles.pointName}>{eachPoints.devicePointName}</p>
                    <p className={styles.pointValue}>{pointValue}{eachPoints.devicePointUnit || ''}</p>
                  </div>)
              })}
            </div>)
          })
        } */}
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
      </div>
    </div>

  )
}

export default DevicePointsData;
