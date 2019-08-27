import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class TimeSelect extends Component {

  static propTypes = {
    timeMode: PropTypes.string,
    timeModeChange: PropTypes.func,
  }

  checkDay = () => {
    const { timeMode, timeModeChange } = this.props;
    timeMode !== 'day' && timeModeChange('day');
  }

  checkMonth = () => {
    const { timeMode, timeModeChange } = this.props;
    timeMode !== 'month' && timeModeChange('month');
  }

  checkYear = () => {
    const { timeMode, timeModeChange } = this.props;
    timeMode !== 'year' && timeModeChange('year');
  }

  render() {
    const { timeMode } = this.props;
    return (
      <div className={styles.timeSelect}>
        <span
          onClick={this.checkDay}
          className={`${styles.day} ${timeMode === 'day' ? styles.choosed : null}`}
        >按日</span>
        <span
          onClick={this.checkMonth}
          className={`${styles.month} ${timeMode === 'month' ? styles.choosed : null}`}
        >按月</span>
        <span
          onClick={this.checkYear}
          className={`${styles.year} ${timeMode === 'year' ? styles.choosed : null}`}
        >按年</span>
      </div>
    );
  }
}

export default TimeSelect;

