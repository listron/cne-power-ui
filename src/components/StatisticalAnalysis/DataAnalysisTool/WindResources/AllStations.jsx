import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './allStations.scss';

export default class AllStations extends Component{
  static propTypes = {
    stations: PropTypes.array,
    theme: PropTypes.string,
    changeWindResourcesStore: PropTypes.func,
    getStationDevice: PropTypes.func,
  };

  selectStation = (stationCode) => {
    const { changeWindResourcesStore, getStationDevice } = this.props;
    changeWindResourcesStore({ stationCode, showPage: 'singleStation' });
    getStationDevice({ stationCode, type: 1 });
  };

  render(){
    const { stations, theme } = this.props;
    const dataList = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return(
      <div className={`${styles.allStationBox}  ${styles[theme]} `}>
        <div className={styles.boxTitle}>风电站列表<span>(点击查看风资源)</span></div>
        <div className={styles.boxCard}>
          {dataList.map((e, i) => (
            <div className={styles.stationCard} key={i.toString()} onClick={(() => this.selectStation(e.stationCode))}>{e.stationName}</div>
          ))}
        </div>
      </div>
    );
  }
}
