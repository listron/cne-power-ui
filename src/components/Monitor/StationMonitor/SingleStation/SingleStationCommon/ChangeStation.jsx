import React from 'react';
import styles from './singleStationCommon.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

function ChangeStation({ stations, stationDetail, baseLinkPath, hideStationChange }){
  const provenceCodes = stations && stations.length>0 ? stations.map(e=>e.provinceCode) : [];
  const stationListSet = new Set(provenceCodes);
  const tmpProvenceCodes = [...stationListSet];
  tmpProvenceCodes.forEach((value,key)=>{
    tmpProvenceCodes[key] = stations.filter(e=>value===e.provinceCode);
  })
  // return (
  //   <div className={styles.stationChange}>
  //     <h4 className={styles.stationTitle}>
  //       <Icon type="swap" onClick={hideStationChange} className={styles.titleIcon} />
  //       <span>{stationDetail.stationName}</span>
  //     </h4>
  //     <div className={styles.stationList} onClick={hideStationChange}>
  //       {stations.map(e=>(<Link className={styles.eachStation} to={`${baseLinkPath}/${e.stationCode}`} key={e.stationCode}>{e.stationName}</Link>))}
  //     </div>
  //   </div>
  // )

  // {tmpProvenceCodes && tmpProvenceCodes.map((item,index)=>{
  //   return (<div key={index}  className={styles.stationChange} >
  //     <div className={styles.provinceName} >
  //       <Icon type="swap" onClick={hideStationChange} className={styles.titleIcon} />
  //       <span>{stationDetail.stationName}</span>
  //     </div>
  //     {item && item.map((e,i)=>{
  //       return (<Link to={`/monitor/singleStation/${e.stationCode}`} key={i} className={styles.eachLink} onClick={hideStationChange} >
  //       <div key={e.stationCode} className={(stationDetail && stationDetail.stationName)===e.stationName ? styles.currentStationName : styles.stationName}   >{e.stationName}</div>
  //       </Link>)
  //     })}
  //   </div>)
  // })}
}
export default ChangeStation;