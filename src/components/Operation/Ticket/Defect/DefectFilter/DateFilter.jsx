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

  onStartChange = (date,dateString) => {
    this.props.onChangeFilter({
      createTimeStart: dateString,
    });
  }
  onEndChange = (date,dateString) => {
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

  render() {
    const { createTimeStart, createTimeEnd } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetTime} className={styles.resetTime} >不限</span>
        <DatePicker
          value={createTimeStart ? moment(createTimeStart) : null}
          placeholder="开始时间"
          onChange={this.onStartChange}
        />
        <DatePicker
          value={createTimeEnd ? moment(createTimeEnd) : null}
          placeholder="截止时间"
          onChange={this.onEndChange}
        />
      </div>
    );
  }

}

export default DateFliter;