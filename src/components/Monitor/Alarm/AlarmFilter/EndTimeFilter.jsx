import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './alarmFilter.scss';
const { RangePicker } = DatePicker;

class EndTimeFilter extends Component {
  static propTypes = {
    endTime: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (date, dateString) => {
    this.props.onChangeFilter({
      endTime: [date[0].toISOString(), date[1].toISOString()]
    });
  }

  onReset = () => { 
    this.props.onChangeFilter({
      endTime: [],
    });
  }

  render() {
    const { endTime } = this.props;
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} className={styles.resetTime} >不限</span>
        <RangePicker
          value={[endTime[0]?moment(endTime[0]):null, endTime[1]?moment(endTime[1]):null]}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default EndTimeFilter;