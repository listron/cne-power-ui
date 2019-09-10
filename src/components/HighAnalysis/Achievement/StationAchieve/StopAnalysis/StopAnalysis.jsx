import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StopElecTypes from './StopElecTypes';
import ChartStopRank from './ChartStopRank';
import ChartStopTrend from './ChartStopTrend';
import ChartStopTypes from './ChartStopTypes';
import styles from './stop.scss';

class StopAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
    stationInfoStr: PropTypes.string,
    pageName: PropTypes.string,
    stopChartDevice: PropTypes.object,
    stopChartTime: PropTypes.string,
    stopChartTypes: PropTypes.object,
    pageQuery: PropTypes.func,
  }

  handleContextMenu = () => {
    event.preventDefault();
    const { stationInfoStr, pageName, stopChartDevice, stopChartTime, stopChartTypes } = this.props;
    if (stopChartDevice || stopChartTime || stopChartTypes) {
      this.props.pageQuery(stationInfoStr, pageName);
    }
  }

  render() {
    const { active } = this.props;
    return (
      <div onContextMenu={this.handleContextMenu} className={`${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <div className={styles.stopAnalysis}>
          <StopElecTypes {...this.props} />
          <ChartStopRank {...this.props} />
          <ChartStopTrend {...this.props} />
          <ChartStopTypes {...this.props} />
        </div>
      </div>
    );
  }
}

export default StopAnalysis;


