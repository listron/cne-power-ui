import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class TimeSelect extends Component {

  static propTypes = {
    lostChartTimeMode: PropTypes.string,
    timeModeChange: PropTypes.func,
  }

  checkDay = () => {
    const { lostChartTimeMode, timeModeChange } = this.props;
    lostChartTimeMode !== 'day' && timeModeChange('day');
  }

  checkMonth = () => {
    const { lostChartTimeMode, timeModeChange } = this.props;
    lostChartTimeMode !== 'month' && timeModeChange('month');
  }

  checkYear = () => {
    const { lostChartTimeMode, timeModeChange } = this.props;
    lostChartTimeMode !== 'year' && timeModeChange('year');
  }

  render() {
    const { lostChartTimeMode } = this.props;
    return (
      <div className={styles.timeSelect}>
        <span
          onClick={this.checkDay}
          className={`${styles.day} ${lostChartTimeMode === 'day' ? styles.choosed : null}`}
        >按日</span>
        <span
          onClick={this.checkMonth}
          className={`${styles.month} ${lostChartTimeMode === 'month' ? styles.choosed : null}`}
        >按月</span>
        <span
          onClick={this.checkYear}
          className={`${styles.year} ${lostChartTimeMode === 'year' ? styles.choosed : null}`}
        >按年</span>
      </div>
    );
  }
}

export default TimeSelect;

