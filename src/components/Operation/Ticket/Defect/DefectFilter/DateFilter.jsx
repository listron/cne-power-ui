import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './defectFilter.scss';

class DefectTable extends Component {
  static propTypes = {
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    changeDefectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onStartChange = (date,dateString) => {
    this.props.changeDefectStore({createTimeStart: dateString})
  }
  onEndChange = (date,dateString) => {
    this.props.changeDefectStore({createTimeEnd: dateString})
  }
  resetTime = () => { //todo 实际应该是请求list，同时保存时间参数
    this.props.changeDefectStore({
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