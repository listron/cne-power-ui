import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './alarmFilter.scss';
const { RangePicker } = DatePicker;

class DateFilter extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (date, dateString) => {
    this.props.onChangeFilter({
      startTime: date[0].toISOString(),
      endTime: date[1].toISOString()
    });
  }

  onReset = () => { 
    this.props.onChangeFilter({
      startTime: '',
      endTime: ''
    });
  }

  render() {
    const { startTime, endTime } = this.props;
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} className={styles.resetTime} >不限</span>
        <RangePicker
          value={[startTime!==''?moment(startTime):null, endTime!==''?moment(endTime):null]}
          placeholder="选择时间范围"
          onChange={this.onChange}
        />
      </div>
    );
  }

}

export default DateFilter;