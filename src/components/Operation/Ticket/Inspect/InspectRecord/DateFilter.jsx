import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './inspectRecord.scss';

class DateFliter extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onStartChange = (date,dateString) => {
    this.props.onChangeFilter({
      startDate: dateString,
    });
  }
  onEndChange = (date,dateString) => {
    this.props.onChangeFilter({
      endDate: dateString
    });
  }
  resetTime = () => { 
    this.props.onChangeFilter({
      endDate: '',
      startDate: '',
    });
  }

  disabledStartDate = (current) => {
    const endDate = this.props.endDate;
    if(endDate && current) {
      return current.valueOf() > moment(endDate);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const startDate = this.props.startDate;
    if(startDate && current) {
      return current.valueOf() < moment(startDate).valueOf();
    }
    return false;
  }

  render() {
    const { startDate, endDate } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetTime} className={startDate===''&&endDate===''?styles.selected:styles.all}>不限</span>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={startDate ? moment(startDate) : null}
          placeholder="开始时间"
          onChange={this.onStartChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={endDate ? moment(endDate) : null}
          placeholder="截止时间"
          onChange={this.onEndChange}
        />
      </div>
    );
  }

}

export default DateFliter;