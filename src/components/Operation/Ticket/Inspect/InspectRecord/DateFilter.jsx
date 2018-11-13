import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './inspectRecord.scss';

class DateFliter extends Component {
  static propTypes = {
    inspectTimeStart: PropTypes.string,
    inspectTimeEnd: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onStartChange = (date,dateString) => {
    this.props.onChangeFilter({
      inspectTimeStart: dateString,
    });
  }
  onEndChange = (date,dateString) => {
    this.props.onChangeFilter({
      inspectTimeEnd: dateString
    });
  }
  resetTime = () => { 
    this.props.onChangeFilter({
      inspectTimeEnd: '',
      inspectTimeStart: '',
    });
  }

  disabledStartDate = (current) => {
    const inspectTimeEnd = this.props.inspectTimeEnd;
    if(inspectTimeEnd && current) {
      return current.valueOf() > moment(inspectTimeEnd);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const inspectTimeStart = this.props.inspectTimeStart;
    if(inspectTimeStart && current) {
      return current.valueOf() < moment(inspectTimeStart).valueOf();
    }
    return false;
  }

  render() {
    const { inspectTimeStart, inspectTimeEnd } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetTime} className={inspectTimeStart===''&&inspectTimeEnd===''?styles.selected:styles.all}>不限</span>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={inspectTimeStart ? moment(inspectTimeStart) : null}
          placeholder="开始时间"
          onChange={this.onStartChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={inspectTimeEnd ? moment(inspectTimeEnd) : null}
          placeholder="截止时间"
          onChange={this.onEndChange}
        />
      </div>
    );
  }

}

export default DateFliter;