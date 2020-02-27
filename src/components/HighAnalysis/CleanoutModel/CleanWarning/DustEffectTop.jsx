import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './cleanStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';

export const DustEffectStation = ({ ...props }) => { // 清洗预警=> 详情电站选择及返回
  const {
    stations, changeStation, showStationList, dustEffectInfo, stationCheckActive, backToList,
  } = props;
  const { stationCode } = dustEffectInfo;
  const currentStation = stations.find(e => e.stationCode === stationCode) || {};
  const provinceSet = new Set(stations.map(e => e.provinceName));
  const provinceArr = [...provinceSet];
  let groupedStation = provinceArr.map(e => ({ // 将电站按所属省份分组
    provinceName: e,
    innerStation: [],
  }));
  stations.forEach(e => {
    groupedStation = groupedStation.map(info => {
      if (info.provinceName === e.provinceName) {
        info.innerStation.push(e);
      }
      return info;
    });
  });
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
                    onClick={() => changeStation({ stationCode: station.stationCode })}
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
      <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={backToList} />
    </div>
  );
};

DustEffectStation.propTypes = {
  stations: PropTypes.array,
  stationCheckActive: PropTypes.bool,
  dustEffectInfo: PropTypes.object,
  changeStation: PropTypes.func,
  showStationList: PropTypes.func,
  backToList: PropTypes.func,
};

export const DustBaseInfo = ({ weatherList = [], dustEffectInfo = {}, theme = 'light' }) => { // 清洗预警 => 详情 影响数据及天气
  const dateArr = ['今天', '明天', '后天'];
  const { influencePower, cleanDays } = dustEffectInfo;
  const value = dataFormat(influencePower, '--', 2);
  let showValue = [];
  if (value >= 0 || `${value}`.includes('.')) {
    showValue = `${value}`.split('.');
  }
  const filterWeather = weatherList.filter((e, i) => i < 3); // 只要前三天数据。
  return (
    <div className={styles.dustInfo}>
      <div className={styles.effectGen}>
        <span className={styles.dustEffectValue}>
          <span className={styles.intValue}>{showValue[0]}</span>
          {showValue[1] && <span className={styles.demicalValue}>.{showValue[1]}</span>}
        </span>
        <span className={styles.text}>昨日灰尘影响电量(万kWh)</span>
      </div>
      <div className={styles.effectDay}>
        <span className={styles.lastCleanValue}>{cleanDays}</span>
        <span className={styles.text}>距最近清洗(天)</span>
      </div>
      <div className={styles.weather}>
        {filterWeather.length > 0 ? filterWeather.map((e, i) => {
          const weatherId = e.weatherId || '';
          return (
            <div className={styles.eachWeather} key={e.weatherDate}>
              <span>{dateArr[i]}</span>
              <img src={`/img/${theme === 'dark' ? 'darkWeathercn' : 'weathercn'}/${e.weatherId.split(',')[0]}.png`} />
              <span>{e.temperature || '--'}</span>
              <span>{e.weather || '--'}</span>
              <span>{e.wind || '--'}</span>
            </div>
          );
        }) : <div className={styles.noWeather}>暂无天气数据</div>}
      </div>
    </div>
  );
};

DustBaseInfo.propTypes = {
  weatherList: PropTypes.array,
  dustEffectInfo: PropTypes.object,
  theme: PropTypes.string,
};
