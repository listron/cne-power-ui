import React from 'react';
import styles from './singleStationCommon.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

function ChangeStation({ stations, stationName, baseLinkPath, hideStationChange, theme = 'light' }) {
  const provenceCodes = stations && stations.length > 0 ? stations.map(e => e.provinceCode) : [];
  const stationListSet = new Set(provenceCodes);
  const tmpProvenceCodes = [...stationListSet];
  tmpProvenceCodes.forEach((value, key) => {
    tmpProvenceCodes[key] = stations.filter(e => value === e.provinceCode);
  });
  return (
    <div className={`${styles.stationChange} ${styles[theme]}`}>
      <h4 className={styles.stationTitle}>
        <Icon type="swap" onClick={hideStationChange} className={styles.titleIcon} />
        <span>{stationName}</span>
      </h4>
      <div className={styles.stationList} onClick={hideStationChange}>
        {tmpProvenceCodes && tmpProvenceCodes.map((item, index) => {
          return (<div key={index} >
            <div className={styles.provinceName} >{item[0].provinceName}</div>
            {item && item.map((e, i) => {
              return (<Link to={`${baseLinkPath}/${e.stationCode}`} key={i} title={e.stationName} className={stationName === e.stationName ? styles.currentStationName : styles.stationName} onClick={hideStationChange}>
                {e.stationName}
              </Link>);
            })}
          </div>);
        })}
      </div>
    </div>
  );
}
export default ChangeStation;
