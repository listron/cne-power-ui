import React from 'react';
import styles from '../eachDeviceMonitor.scss'

function DevicePointsData({ devicePointData, deviceDetail }) {
  devicePointData = devicePointData.sort((a, b) => (a.devicePointCode.localeCompare(b.devicePointCode)))
  // let devicePointIECGroup1 = [...new Set(devicePointData.map(e => e.devicePointIECGroup))]
  let devicePointIECGroup = ['整机系统', '变桨系统', '传动系统', '发电机', '变频器', '偏航系统', '机舱系统', '塔筒系统', '箱变系统', '测风塔', '其它']
  // console.log('devicePointIECGroup',devicePointData)
  let ponitGroup = devicePointIECGroup.map(e => {
    return devicePointData.filter((item, index) => {
      if (item.devicePointIECGroup === e) {
        return item
      }
    })
  })
  // console.log('ponitGroup', ponitGroup)
  let pointListGroups = ponitGroup.map((item, index) => {
    let pointListGroup = [], startIndex = 0;
    do {
      let eachPointGroup = item.slice(startIndex, startIndex + 10);
      startIndex += 10;
      pointListGroup.push(eachPointGroup);
    } while (startIndex < item.length);
    return pointListGroup
  })

  // console.log('pointListGroups', pointListGroups)
  return (
    <div className={styles.pointData} >
      <div className={styles.pointTitle}>{deviceDetail.deviceTypeName || ''}实时测点数据</div>
      <div className={styles.pointDataList} >
        {pointListGroups.length > 0 && pointListGroups.map((item, key) => {
          return item.map((e, i) => {
            if (e.length > 0) {
              return (<div className={styles.eachGroup} key={i}>
                {i === 0 && <div className={styles.groupName}>{devicePointIECGroup[key]}</div>}
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
            }
          })
        }) }
      </div>
    </div>

  )
}

export default DevicePointsData;
