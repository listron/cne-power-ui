import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './inspectFilter.scss';

class DefectTable extends Component {
  static propTypes = {
    listQueryParams: PropTypes.object,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    getInspectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onStartChange = (date,dateString) => {
    this.props.getInspectList({
      ...this.props.listQueryParams,
      createTimeStart: dateString,
    })
  }
  onEndChange = (date,dateString) => {
    this.props.getInspectList({
      ...this.props.listQueryParams,
      createTimeEnd: dateString
    })
  }
  resetTime = () => { 
    this.props.getInspectList({
      ...this.props.listQueryParams,
      createTimeEnd: '',
      createTimeStart: '',
    })
  }

  render() {
    const { createTimeStart, createTimeEnd } = this.props;
    return (
      <div className={styles.dateFilter}>
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

export default DefectTable;