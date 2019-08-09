import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class TimeSelect extends Component {

  static propTypes = {
    chartTimeMode: PropTypes.string,
    timeModeChange: PropTypes.func,
  }

  checkDay = () => {
    const { chartTimeMode, timeModeChange } = this.props;
    chartTimeMode !== 'day' && timeModeChange('day');
  }

  checkMonth = () => {
    const { chartTimeMode, timeModeChange } = this.props;
    chartTimeMode !== 'month' && timeModeChange('month');
  }

  checkYear = () => {
    const { chartTimeMode, timeModeChange } = this.props;
    chartTimeMode !== 'year' && timeModeChange('year');
  }

  render() {
    const { chartTimeMode } = this.props;
    return (
      <div className={styles.timeSelect}>
        <span
          onClick={this.checkDay}
          className={`${styles.day} ${chartTimeMode === 'day' ? styles.choosed : null}`}
        >按日</span>
        <span
          onClick={this.checkMonth}
          className={`${styles.month} ${chartTimeMode === 'month' ? styles.choosed : null}`}
        >按月</span>
        <span
          onClick={this.checkYear}
          className={`${styles.year} ${chartTimeMode === 'year' ? styles.choosed : null}`}
        >按年</span>
      </div>
    );
  }
}

export default TimeSelect;

