import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './meterRead.scss';

class MeterReadAllSatation extends Component{
  static propTypes = {
    stations: PropTypes.array,
    theme: PropTypes.string,
    changeMeterReadSetStore: PropTypes.func,
    getMeterList: PropTypes.func,
  }
  constructor(props){
    super(props);
  }

  stationInfo = (stationCode) => { // 进入单电站列表页
    const { changeMeterReadSetStore, getMeterList } = this.props;
    changeMeterReadSetStore({stationCode, showPage: 'singleStation'});
    getMeterList({stationCode});
  }

  render(){
    const { stations, theme } = this.props;
    const dataList = stations.filter(e => e.isConnected === 1);
    return(
      <div className={`${styles.meterReadAllSatation} ${styles[theme]}`}>
        <div className={styles.title}>电站列表</div>
        <div className={styles.stationsBox}>
          {dataList.map(e => (
            <div
              className={styles.stationCard}
              key={e.stationCode}
              // title={e.stationName} // 鼠标hover显示电站名称
              onClick={() => this.stationInfo(e.stationCode)}
            >
              {e.stationName}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default MeterReadAllSatation;
