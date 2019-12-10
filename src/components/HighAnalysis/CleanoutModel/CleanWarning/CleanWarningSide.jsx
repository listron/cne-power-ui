
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
    theme: PropTypes.string,
    matrixStartDay: PropTypes.string,
    matrixEndDay: PropTypes.string,
    totalStartDay: PropTypes.string,
    totalEndDay: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCheckActive: false,
    };
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

  changeStation = ({ stationCode }) => { // 切换电站并隐藏切换框
    const { getCleanWarningDetail, getTotalDustEffect, getMatrixDustEffect, dustEffectInfo, matrixStartDay, matrixEndDay, totalStartDay, totalEndDay } = this.props;
    if (dustEffectInfo.stationCode === stationCode) {
      return;
    }
    this.setState({
      stationCheckActive: false,
    });
    const totalEffectParam = {
      stationCode, endDay: totalEndDay, startDay: totalStartDay,
    };
    const matrixEffectParam = {
      stationCode, endDay: matrixEndDay, startDay: matrixStartDay,
    };

    getCleanWarningDetail({ stationCode });
    getTotalDustEffect(totalEffectParam);
    getMatrixDustEffect(matrixEffectParam);
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanWarningStore({ showPage: 'list' });
  }

  render() {
    const { stations, dustEffectInfo, weatherList, theme } = this.props;
    const { stationCheckActive } = this.state;
    return (
      <div className={`${styles.clearWarningSide} ${styles[theme]}`} onClick={this.hiddenStationList}>
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
            theme={theme}
          />
          <DustEffectCharts {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default CleanWarningSide;
