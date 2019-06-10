

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Icon, Progress, Modal, Input } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
import Operator from '../../WindCommon/Operator';


class PvStationTop extends Component {
  static propTypes = {
    match: PropTypes.object,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
    weatherList: PropTypes.array,
    operatorList: PropTypes.array,
    operatorTime: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      showStationList: false,
    }
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  showStationList = () => {
    this.setState({
      showStationList: true,
    });
  }

  hideStationChange = () => {
    this.setState({
      showStationList: false,
    });
  }

  render() {
    const { singleStationData = {}, stationList, weatherList, operatorList,operatorTime } = this.props;
    const { showStationList } = this.state;
    const baseLinkPath = `/monitor/singleStation`;
    const pathAllStation = "/monitor/station";
    const currentStationName = singleStationData.stationName;
    const { stationStatus = {} } = singleStationData;
    const { stationStatusName, stationStatusTime } = stationStatus;
    const todayWeatherData=weatherList.filter(e=>moment(moment()).isSame(e.weatherDate, 'day'))
    const todayWeather =  todayWeatherData.length>0 && todayWeatherData[0]
    return (
      <div className={styles.stationTop} >
        {showStationList && <ChangeStation stations={stationList.filter(e => e.isConnected === 1)} stationName={singleStationData.stationName} baseLinkPath={baseLinkPath} hideStationChange={this.hideStationChange} />}
        <div className={styles.stationTitle}>
          <div className={styles.stationLeft} >
            <div onClick={this.showStationList} className={styles.stationToggle} id="stationToggle" >
              <Icon type="swap" />
              <h3>{currentStationName}-{singleStationData.provinceName}</h3>
            </div>
            <div>
              <span>电站状态：{stationStatusName}</span>
              {stationStatus.stationStatus === 500 && <span>数据中断时间:{stationStatusTime && moment(stationStatusTime).fromNow() || ''}</span>}
            </div>
          </div>
          <div className={styles.stationRight}>
            <Operator operatorList={operatorList} operatorTime={operatorTime} />
            <div className={styles.weather}>天气:{todayWeather.weather} {todayWeather.temperature || '暂无天气情况'}</div>
            <Link to={pathAllStation}  >
              <Icon type="arrow-left" className={styles.backIcon} />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default PvStationTop;
