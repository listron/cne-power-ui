import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './filterCondition.scss';

class DateFliter extends Component {
  static propTypes = {
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onStartChange = (date, dateString) => {
    const { option = {} } = this.props;
    const [startTime, endTime] = option.checkedValue;
    option.checkedValue = [dateString, endTime];
    this.props.onChangeFilter({ option });
  }
  onEndChange = (date, dateString) => {
    const { option = {} } = this.props;
    const [startTime, endTime] = option.checkedValue;
    option.checkedValue = [startTime, dateString];
    this.props.onChangeFilter({ option });
  }

  resetTime = () => {
    const { option = {} } = this.props;
    option.checkedValue = [];
    this.props.onChangeFilter({ option });
  }

  disabledStartDate = (current) => {
    const { option = {} } = this.props;
    const [startTime, endTime] = option.checkedValue;
    if (endTime && current) {
      return current.valueOf() > moment(endTime);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const { option = {} } = this.props;
    const [startTime, endTime] = option.checkedValue;
    if (startTime && current) {
      return current.valueOf() < moment(startTime).valueOf();
    }
    return false;
  }

  render() {
    const { option = {} } = this.props;
    const { checkedValue = [] } = option;
    const [startTime, endTime] = checkedValue;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetTime} className={!startTime && !endTime ? styles.selected : styles.all}>不限</span>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={startTime ? moment(startTime) : null}
          placeholder="开始时间"
          onChange={this.onStartChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={endTime ? moment(endTime) : null}
          placeholder="截止时间"
          onChange={this.onEndChange}
        />
      </div>
    );
  }

}

export default DateFliter;
