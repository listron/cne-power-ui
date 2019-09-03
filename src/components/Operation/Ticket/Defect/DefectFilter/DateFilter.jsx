import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './defectFilter.scss';

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
    this.props.onChangeFilter({
      createTimeStart: dateString,
    });
  }
  onEndChange = (date, dateString) => {
    this.props.onChangeFilter({
      createTimeEnd: dateString
    });
  }
  resetTime = () => {
    this.props.onChangeFilter({
      createTimeEnd: '',
      createTimeStart: '',
    });
  }

  disabledStartDate = (current) => {
    const createTimeEnd = this.props.createTimeEnd;
    if (createTimeEnd && current) {
      return current.valueOf() > moment(createTimeEnd);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const createTimeStart = this.props.createTimeStart;
    if (createTimeStart && current) {
      return current.valueOf() < moment(createTimeStart).valueOf();
    }
    return false;
  }

  render() {
    const { createTimeStart, createTimeEnd, theme } = this.props;
    return (
      <div className={`${styles.filterItem} ${styles[theme]}`}>
        <span ref="wrap" />
        <span onClick={this.resetTime} className={createTimeStart === '' && createTimeEnd === '' ? styles.selected : styles.all}>不限</span>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={createTimeStart ? moment(createTimeStart) : null}
          placeholder="开始时间"
          onChange={this.onStartChange}
          getCalendarContainer={() => this.refs.wrap}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={createTimeEnd ? moment(createTimeEnd) : null}
          placeholder="截止时间"
          onChange={this.onEndChange}
          getCalendarContainer={() => this.refs.wrap}
        />
      </div>
    );
  }

}

export default DateFliter;