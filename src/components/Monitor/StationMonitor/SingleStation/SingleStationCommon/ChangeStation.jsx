import React from 'react';
import styles from './singleStationCommon.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

function ChangeStation({ stations, stationDetail, baseLinkPath, hideStationChange }){

  return (
    <div className={styles.stationChange}>
      <h4 className={styles.stationTitle}>
        <Icon type="swap" onClick={hideStationChange} className={styles.titleIcon} />
        <span>{stationDetail.stationName}</span>
      </h4>
      <div className={styles.stationList} onClick={hideStationChange}>
        {stations.map(e=>(<Link className={styles.eachStation} to={`${baseLinkPath}/${e.stationCode}`} key={e.stationCode}>{e.stationName}</Link>))}
      </div>
    </div>
  )
}
export default ChangeStation;