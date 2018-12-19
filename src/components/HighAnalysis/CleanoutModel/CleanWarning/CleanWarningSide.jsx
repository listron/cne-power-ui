
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanStyle.scss';
import moment from 'moment';
import { DustEffectStation, DustBaseInfo } from './DustEffectTop';
import DustEffectCharts from './DustEffectCharts';
import Footer from '../../../Common/Footer';

class CleanWarningSide extends Component {
  static propTypes = {
    stations: PropTypes.array,
    weatherList: PropTypes.array,
    dustEffectInfo: PropTypes.object,
    getCleanWarningDetail: PropTypes.func,
    getTotalDustEffect: PropTypes.func,
    getMatrixDustEffect: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCheckActive: false,
    }
  }

  hiddenStationList = () => { // 隐藏电站切换框
    const { stationCheckActive } = this.state;
    stationCheckActive && this.setState({
      stationCheckActive: false,
    });
  }

  showStationList = () => { // 显示电站切换框
    this.setState({
      stationCheckActive: true,
    });
  }

  changeStation = ({stationCode}) => { // 切换电站并隐藏切换框
    const { getCleanWarningDetail, getTotalDustEffect, getMatrixDustEffect, dustEffectInfo } = this.props;
    if (dustEffectInfo.stationCode === stationCode) {
      return;
    }
    const endDay = moment().format('YYYY-MM-DD');
    const startDay = moment().subtract(30, 'day').format('YYYY-MM-DD'); 
    this.setState({
      stationCheckActive: false,
    });
    const effectParam = {
      stationCode, endDay, startDay
    }
    getCleanWarningDetail({ stationCode });
    getTotalDustEffect(effectParam);
    getMatrixDustEffect(effectParam);
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanWarningStore({showPage: 'list'});
  }

  render(){
    const {
      stations, dustEffectInfo, weatherList,
    } = this.props;
    const { stationCheckActive } = this.state;
    return (
      <div className={styles.clearWarningSide} onClick={this.hiddenStationList}>
        <div className={styles.sideContent}>
          <DustEffectStation
            dustEffectInfo={dustEffectInfo}
            stations={stations.filter(e => e.stationType === 1)}
            changeStation={this.changeStation}
            showStationList={this.showStationList}
            stationCheckActive={stationCheckActive}
            backToList={this.backToList}
          />
          <DustBaseInfo
            dustEffectInfo={dustEffectInfo}
            weatherList={weatherList}
          />
          <DustEffectCharts {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningSide;
