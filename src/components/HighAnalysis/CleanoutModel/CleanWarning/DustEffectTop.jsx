import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './cleanStyle.scss';

export const DustEffectStation = ({...props}) => {
  const {
    stations, stationChange, showStationList, dustEffectInfo, stationCheckActive, backToList
  } = props;
  console.log(props)
  const { stationCode } = dustEffectInfo;
  const currentStation = stations.find(e => e.stationCode === stationCode) || {};
  const provinceSet = new Set(stations.map(e => e.provinceName));
  const provinceArr = [...provinceSet];
  let groupedStation = provinceArr.map(e => ({
    provinceName: e,
    innerStation: []
  }));
  stations.forEach(e => {
    groupedStation = groupedStation.map(info => {
      if (info.provinceName === e.provinceName) {
        info.innerStation.push(e);
      }
      return info
    })
  })
  // 将电站按所属省份分组
  return (
    <div className={styles.topStations}>
      {stationCheckActive && <div className={styles.stationList}>
        <h3 className={styles.title}>
          <Icon type="swap" />
          <span>{currentStation.stationName || '--'} - {currentStation.provinceName || '--'}</span>
        </h3>
        <div className={styles.eachProvince}>
          {groupedStation.map(provinceInfo => (
            <div key={provinceInfo.provinceName}>
              <h3 className={styles.provinceName}>{provinceInfo.provinceName}</h3>
              <div className={styles.stationContent}>
                {provinceInfo.innerStation.map(station => (
                  <span
                    key={station.stationName}
                    className={styles.stationName}
                    onClick={() => stationChange({stationCode: station.stationCode})}
                  >
                    {station.stationName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>}
      <div className={styles.leftPart}>
        <Icon type="swap" onClick={showStationList} />
        <span className={styles.stationName}>
          {currentStation.stationName || '--'} - {currentStation.provinceName || '--'}
        </span>
      </div>
      <div className={styles.rightPart} onClick={backToList}>
        <Icon type="arrow-left" className={styles.backIcon} />
      </div>
    </div>
  )
}

DustEffectStation.propTypes = {
  stations: PropTypes.array,
  stationCheckActive: PropTypes.bool,
  dustEffectInfo: PropTypes.object,
  stationChange: PropTypes.func,
  showStationList: PropTypes.func,
  backToList: PropTypes.func,
}

export const DustBaseInfo = ({}) => {
  const arr = [1, 2, 3];
  return (
    <div className={styles.dustInfo}>
      <div>
        <span>219.48</span>
        <span>昨日灰尘影响电量(万kWh)</span>
      </div>
      <div>
        <span>9</span>
        <span>距最近清洗(天)</span>
      </div>
      <div>
        {arr.map(e => (
          <div>
            <span>今天</span>
            <span>天气图</span>
            <span>温度</span>
            <span>天气</span>
            <span>风向风速</span>
          </div>
        ))}
      </div>
    </div>
  )
}