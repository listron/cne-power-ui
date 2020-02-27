

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Icon, Progress, Modal, Input, Drawer } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
import { monitordataFormat } from '../../../../../utils/utilFunc';
import { ValueFormat, DeviceValueFormat } from '../../../../Common/UtilComponent';
import Operator from '../../WindCommon/Operator';
class WindStationTop extends Component {
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
    };

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
    const { singleStationData = {}, stationList, weatherList, operatorList, operatorTime } = this.props;
    const { showStationList } = this.state;
    const baseLinkPath = '/monitor/singleStation';
    const pathAllStation = '/monitor/station';
    const currentStationName = singleStationData.stationName;
    const { stationStatus = {} } = singleStationData;
    const { stationStatusName, stationStatusTime } = stationStatus;
    const todayWeather = weatherList.length > 0 && weatherList[0] || {};
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
              {stationStatus.stationStatus === 500 && <span>时间:{stationStatusTime && moment(stationStatusTime).fromNow() || ''}</span>}
            </div>
          </div>
          <div className={styles.stationRight}>
            <Operator operatorList={operatorList} operatorTime={operatorTime} />
            <div className={styles.weather}>天气:{todayWeather.weather} {todayWeather.temperature}</div>
            <Link to={pathAllStation} >
              <i className={`iconfont icon-fanhui ${styles.backIcon}`} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default WindStationTop;
