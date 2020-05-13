
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
    matrixStartDay: PropTypes.object,
    matrixEndDay: PropTypes.object,
    totalStartDay: PropTypes.object,
    totalEndDay: PropTypes.object,
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
      stationCode, endDay: totalEndDay.format('YYYY-MM-DD'), startDay: totalStartDay.format('YYYY-MM-DD'),
    };
    const matrixEffectParam = {
      stationCode, endDay: matrixEndDay.format('YYYY-MM-DD'), startDay: matrixStartDay.format('YYYY-MM-DD'),
    };

    getCleanWarningDetail({ stationCode });
    getTotalDustEffect(totalEffectParam);
    getMatrixDustEffect(matrixEffectParam);
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanWarningStore({
      showPage: 'list',
      matrixStartDay: moment().subtract(1, 'days'),
      matrixEndDay: moment().subtract(1, 'days'),
      totalStartDay: moment().subtract(1, 'months').add(-1, 'days'),
      totalEndDay: moment().subtract(1, 'days'),
   });
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
