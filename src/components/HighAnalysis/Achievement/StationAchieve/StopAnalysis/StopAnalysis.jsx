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
  }

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.stopAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <StopElecTypes {...this.props} />
        <ChartStopRank {...this.props} />
        <ChartStopTrend {...this.props} />
        <ChartStopTypes {...this.props} />
      </div>
    );
  }
}

export default StopAnalysis;


