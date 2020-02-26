import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './meterRead.scss';

class MeterReadAllSatation extends Component{
  static propTypes = {
    stations: PropTypes.array,
    theme: PropTypes.string,
    changeMeterReadSetStore: PropTypes.func,
    getMeterList: PropTypes.func,
    getBaseDevice: PropTypes.func,
    getPriceDetail: PropTypes.func,
    stationsDataError: PropTypes.bool,
  }
  constructor(props){
    super(props);
  }

  stationInfo = (stationCode) => { // 进入单电站列表页
    const { changeMeterReadSetStore, getMeterList, getBaseDevice, getPriceDetail, stations } = this.props;
    const selectStation = stations.find(e => {
      return e.stationCode === stationCode;
    }) || {};
    changeMeterReadSetStore({stationName: selectStation.stationName, stationCode, showPage: 'singleStation'});
    getMeterList({stationCode});
    getBaseDevice({stationCode});
    getPriceDetail({stationCode});
  }

  render(){
    const { stations, theme, stationsDataError } = this.props;
    const dataList = stations.filter(e => (e.stationType === 1 && e.isConnected === 1));
    return(
      <div className={`${styles.meterReadAllSatation} ${styles[theme]}`}>
        <div className={styles.title}><i className="iconfont icon-home" />电站列表</div>
        <div className={styles.stationsBox}>
          {stationsDataError ? <img width="84" height="77" src="/img/datawrong.png" /> : <div className={styles.stationData}>
          {dataList.length > 0 ?
          <div>
            <div className={styles.stationsNameData}>
              {dataList.map(e => (
                <div
                  className={styles.stationCard}
                  key={e.stationCode}
                  onClick={() => this.stationInfo(e.stationCode)}
                >
                  {e.stationName}
                </div>
              ))}
            </div>
            <div className={styles.noMoreData}>
              <img width="97" height="72" src="/img/notabdata97-72.png" />
            </div>
          </div>
            : 
            <div className={styles.nodata}><img width="223" height="164" src="/img/nodata.png" /></div>
            }
          </div>}
        </div>
      </div>
    );
  }
}

export default MeterReadAllSatation;
