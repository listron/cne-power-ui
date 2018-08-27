import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './alarmFilter.scss';
const { RangePicker } = DatePicker;

class StartTimeFilter extends Component {
  static propTypes = {
    startTime: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (date, dateString) => {
    this.props.onChangeFilter({
      startTime: [date[0].toISOString(), date[1].toISOString()]
    });
  }

  onReset = () => { 
    this.props.onChangeFilter({
      startTime: [],
    });
  }

  render() {
    const { startTime } = this.props;
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} className={styles.resetTime} >不限</span>
        <RangePicker
          value={[startTime[0]?moment(startTime[0]):null, startTime[1]?moment(startTime[1]):null]}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default StartTimeFilter;